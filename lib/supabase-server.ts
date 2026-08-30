import fs from "fs"
import path from "path"

/**
 * lib/supabase-server.ts
 * 
 * Self-Hosted VPS Local Storage Engine for PreYT.
 * High-performance, zero-latency local JSON ledger on the server / VPS.
 * Implements a chainable query builder compatible with standard DB call patterns.
 */

const DATA_DIR = path.join(process.cwd(), "data")

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

const TABLE_FILE_MAP: Record<string, string> = {
  beta_waitlist: "waitlist_fallback.json",
  waitlist: "waitlist_fallback.json",
  cms_blogs: "cms_blogs.json",
  cms_users: "cms_users.json",
  cms_team: "cms_team.json",
  cms_backlinks: "cms_backlinks.json",
  activity_feed: "activity_feed.json",
  usage_logs: "usage_logs.json",
  scan_usage_logs: "scan_usage_logs.json",
}

function getTableFilePath(tableName: string): string {
  ensureDirectoryExists(DATA_DIR)
  const fileName = TABLE_FILE_MAP[tableName] || `${tableName}.json`
  const filePath = path.join(DATA_DIR, fileName)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8")
  }
  return filePath
}

function readTableRows(tableName: string): any[] {
  try {
    const filePath = getTableFilePath(tableName)
    const raw = fs.readFileSync(filePath, "utf-8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeTableRows(tableName: string, rows: any[]): void {
  try {
    const filePath = getTableFilePath(tableName)
    fs.writeFileSync(filePath, JSON.stringify(rows, null, 2), "utf-8")
  } catch (err) {
    console.error(`[LocalQueryBuilder] Failed to write ${tableName}:`, err)
  }
}

export class LocalQueryBuilder {
  private table: string
  private filters: ((row: any) => boolean)[] = []
  private orderField: string | null = null
  private ascending = true
  private limitCount: number | null = null
  private isSingle = false
  private selectFields: string[] | null = null
  private pendingAction: { type: "select" | "insert" | "update" | "upsert" | "delete"; payload?: any; options?: any } = { type: "select" }

  constructor(table: string) {
    this.table = table
  }

  select(fields = "*"): this {
    if (fields && fields !== "*") {
      this.selectFields = fields.split(",").map((f) => f.trim())
    }
    return this
  }

  insert(records: any | any[]): this {
    this.pendingAction = { type: "insert", payload: records }
    return this
  }

  update(patch: any): this {
    this.pendingAction = { type: "update", payload: patch }
    return this
  }

  upsert(records: any | any[], options: { onConflict?: string } = {}): this {
    this.pendingAction = { type: "upsert", payload: records, options }
    return this
  }

  delete(): this {
    this.pendingAction = { type: "delete" }
    return this
  }

  eq(column: string, value: any): this {
    this.filters.push((row) => row[column] === value)
    return this
  }

  ilike(column: string, value: string): this {
    const pattern = value.replace(/%/g, "").toLowerCase()
    this.filters.push((row) => {
      const field = String(row[column] || "").toLowerCase()
      return field.includes(pattern)
    })
    return this
  }

  order(column: string, options: { ascending?: boolean } = {}): this {
    this.orderField = column
    this.ascending = options.ascending ?? true
    return this
  }

  limit(count: number): this {
    this.limitCount = count
    return this
  }

  single(): this {
    this.isSingle = true
    return this
  }

  private execute(): { data: any; error: any } {
    try {
      if (this.pendingAction.type === "insert") {
        const records = this.pendingAction.payload
        const list = Array.isArray(records) ? records : [records]
        const current = readTableRows(this.table)
        const stamped = list.map((item) => ({
          id: item.id || "rec_" + Math.random().toString(36).substring(2, 12),
          created_at: item.created_at || new Date().toISOString(),
          ...item,
        }))
        writeTableRows(this.table, [...current, ...stamped])
        return { data: Array.isArray(records) ? stamped : stamped[0], error: null }
      }

      if (this.pendingAction.type === "update") {
        const patch = this.pendingAction.payload
        const current = readTableRows(this.table)
        const updatedRows: any[] = []

        const modified = current.map((row) => {
          let matches = true
          for (const filter of this.filters) {
            if (!filter(row)) {
              matches = false
              break
            }
          }
          if (matches) {
            const newRow = { ...row, ...patch, updated_at: new Date().toISOString() }
            updatedRows.push(newRow)
            return newRow
          }
          return row
        })

        writeTableRows(this.table, modified)
        return { data: this.isSingle ? (updatedRows[0] || null) : updatedRows, error: null }
      }

      if (this.pendingAction.type === "upsert") {
        const records = this.pendingAction.payload
        const list = Array.isArray(records) ? records : [records]
        const current = readTableRows(this.table)
        const conflictCol = this.pendingAction.options?.onConflict || "id"

        for (const item of list) {
          const idx = current.findIndex(
            (r) => r[conflictCol] && String(r[conflictCol]).toLowerCase() === String(item[conflictCol]).toLowerCase()
          )
          if (idx >= 0) {
            current[idx] = { ...current[idx], ...item, updated_at: new Date().toISOString() }
          } else {
            current.push({
              id: item.id || "rec_" + Math.random().toString(36).substring(2, 12),
              created_at: item.created_at || new Date().toISOString(),
              ...item,
            })
          }
        }

        writeTableRows(this.table, current)
        return { data: this.isSingle ? list[0] : list, error: null }
      }

      if (this.pendingAction.type === "delete") {
        const current = readTableRows(this.table)
        const kept: any[] = []
        const deleted: any[] = []

        for (const row of current) {
          let matches = true
          for (const filter of this.filters) {
            if (!filter(row)) {
              matches = false
              break
            }
          }
          if (matches) {
            deleted.push(row)
          } else {
            kept.push(row)
          }
        }

        writeTableRows(this.table, kept)
        return { data: deleted, error: null }
      }

      // Default: select query
      let rows = readTableRows(this.table)

      for (const filter of this.filters) {
        rows = rows.filter(filter)
      }

      if (this.orderField) {
        const field = this.orderField
        const asc = this.ascending
        rows.sort((a, b) => {
          const valA = a[field] ?? ""
          const valB = b[field] ?? ""
          if (valA < valB) return asc ? -1 : 1
          if (valA > valB) return asc ? 1 : -1
          return 0
        })
      }

      if (this.limitCount !== null) {
        rows = rows.slice(0, this.limitCount)
      }

      if (this.selectFields && this.selectFields.length > 0) {
        const fields = this.selectFields
        rows = rows.map((row) => {
          const projected: Record<string, any> = {}
          for (const f of fields) {
            projected[f] = row[f]
          }
          return projected
        })
      }

      return this.isSingle
        ? { data: rows[0] || null, error: null }
        : { data: rows, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message || String(err) } }
    }
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const res = this.execute()
    return Promise.resolve(res).then(onfulfilled, onrejected)
  }
}

export const supabaseServer = {
  from: (table: string) => new LocalQueryBuilder(table),
}
