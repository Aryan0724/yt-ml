import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export const runtime = "nodejs"

/**
 * GET: Retrieves all blogs with their associated SEO metadata
 */
export async function GET() {
  try {
    // Query blogs and join with seo metadata
    const { data: blogs, error } = await supabaseServer
      .from("cms_blogs")
      .select(`
        *,
        seo_metadata:cms_seo_metadata(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ status: "success", data: blogs })
  } catch (err: any) {
    console.error("Error fetching CMS blogs:", err)
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to retrieve blogs." },
      { status: 500 }
    )
  }
}

/**
 * POST: Creates or updates a blog article and its SEO metadata
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { 
      id, title, slug, content, excerpt, featured_image, 
      reading_time, status, is_featured, seo_metadata, category_id 
    } = payload

    if (!title || !content) {
      return NextResponse.json(
        { status: "error", message: "Title and content body are required parameters." },
        { status: 400 }
      )
    }

    const blogData = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      content,
      excerpt: excerpt || "",
      featured_image: featured_image || "",
      reading_time: reading_time || 1,
      status: status || "Draft",
      is_featured: !!is_featured,
      category_id: category_id || null,
      updated_at: new Date().toISOString()
    }

    let savedBlogId = id

    if (id && !id.startsWith("b_")) {
      // Update existing record
      const { error: blogError } = await supabaseServer
        .from("cms_blogs")
        .update(blogData)
        .eq("id", id)

      if (blogError) throw blogError
    } else {
      // Insert new record
      const { data: newBlog, error: blogError } = await supabaseServer
        .from("cms_blogs")
        .insert([{ ...blogData, views_count: 0 }])
        .select()
        .single()

      if (blogError) throw blogError
      savedBlogId = newBlog.id
    }

    // Upsert associated SEO metadata
    if (seo_metadata) {
      const seoData = {
        blog_id: savedBlogId,
        seo_title: seo_metadata.seo_title || title,
        meta_description: seo_metadata.meta_description || "",
        focus_keyword: seo_metadata.focus_keyword || "",
        secondary_keywords: seo_metadata.secondary_keywords || [],
        canonical_url: seo_metadata.canonical_url || "",
        og_title: seo_metadata.og_title || title,
        og_description: seo_metadata.og_description || "",
        og_image: seo_metadata.og_image || featured_image || "",
        robots_index: seo_metadata.robots_index !== false,
        robots_follow: seo_metadata.robots_follow !== false,
        readability_score: seo_metadata.readability_score || 0,
        seo_score: seo_metadata.seo_score || 0,
        schema_markup: seo_metadata.schema_markup || {},
        updated_at: new Date().toISOString()
      }

      // Check if SEO record already exists
      const { data: existingSeo } = await supabaseServer
        .from("cms_seo_metadata")
        .select("id")
        .eq("blog_id", savedBlogId)
        .single()

      if (existingSeo) {
        const { error: seoError } = await supabaseServer
          .from("cms_seo_metadata")
          .update(seoData)
          .eq("blog_id", savedBlogId)

        if (seoError) throw seoError
      } else {
        const { error: seoError } = await supabaseServer
          .from("cms_seo_metadata")
          .insert([seoData])

        if (seoError) throw seoError
      }
    }

    return NextResponse.json({ 
      status: "success", 
      message: "Article saved successfully.", 
      data: { id: savedBlogId } 
    })
  } catch (err: any) {
    console.error("Error saving CMS article:", err)
    return NextResponse.json(
      { status: "error", message: err.message || "Failed to save article." },
      { status: 500 }
    )
  }
}
