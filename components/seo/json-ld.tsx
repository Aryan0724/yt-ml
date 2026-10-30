import React from "react"

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
  sameAs?: string[]
}

export function OrganizationSchema({
  name = "PreYT",
  url = "https://preyt.integralgroups.in",
  logo = "https://preyt.integralgroups.in/preyt-logo-dark.png",
  description = "Pre-upload YouTube packaging decision engine and performance forecasting platform.",
  sameAs = ["https://twitter.com/preYTAI"]
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    sameAs
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface SoftwareAppSchemaProps {
  name?: string
  description?: string
  operatingSystem?: string
  applicationCategory?: string
  price?: string
  priceCurrency?: string
}

export function SoftwareAppSchema({
  name = "PreYT Creator Intelligence Engine",
  description = "Audit YouTube draft thumbnails and titles against millions of uploads to predict click-through rate, glanceability, and retention risk before publishing.",
  operatingSystem = "Web Browser",
  applicationCategory = "MultimediaApplication",
  price = "0",
  priceCurrency = "USD"
}: SoftwareAppSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    operatingSystem,
    applicationCategory,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FaqItem {
  question: string
  answer: string
}

export function FaqSchema({ items }: { items: FaqItem[] }) {
  if (!items || items.length === 0) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `https://preyt.integralgroups.in${item.url}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ArticleSchemaProps {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  authorName?: string
  image?: string
}

export function ArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName = "PreYT Research Team",
  image = "https://preyt.integralgroups.in/preyt-logo-dark.png"
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
      url: "https://preyt.integralgroups.in"
    },
    publisher: {
      "@type": "Organization",
      name: "PreYT",
      url: "https://preyt.integralgroups.in",
      logo: {
        "@type": "ImageObject",
        url: "https://preyt.integralgroups.in/preyt-logo-dark.png"
      }
    },
    image: image.startsWith("http") ? image : `https://preyt.integralgroups.in${image}`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
