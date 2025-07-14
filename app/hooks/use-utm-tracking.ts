"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"

export interface UTMParams {
  utm_source?: string
  utm_campaign?: string
  utm_medium?: string
  utm_content?: string
  utm_term?: string
}

export function useUTMTracking() {
  const searchParams = useSearchParams()
  const [utmParams, setUtmParams] = useState<UTMParams>({})

  useEffect(() => {
    // Extract UTM parameters from URL
    const urlParams: UTMParams = {
      utm_source: searchParams?.get("utm_source") || undefined,
      utm_campaign: searchParams?.get("utm_campaign") || undefined,
      utm_medium: searchParams?.get("utm_medium") || undefined,
      utm_content: searchParams?.get("utm_content") || undefined,
      utm_term: searchParams?.get("utm_term") || undefined,
    }

    // Filter out undefined values
    const filteredUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([_, value]) => value !== undefined),
    ) as UTMParams

    // Check if we have new UTM parameters from URL
    if (Object.keys(filteredUrlParams).length > 0) {
      // Only update if the params are actually different
      const currentParamsString = JSON.stringify(utmParams)
      const newParamsString = JSON.stringify(filteredUrlParams)

      if (currentParamsString !== newParamsString) {
        setUtmParams(filteredUrlParams)
        localStorage.setItem("utmParams", JSON.stringify(filteredUrlParams))
        console.log("UTM parameters captured and stored:", filteredUrlParams)
      }
    } else if (Object.keys(utmParams).length === 0) {
      // Only load from localStorage if we don't have URL params and state is empty
      try {
        const storedParams = localStorage.getItem("utmParams")
        if (storedParams) {
          const parsed = JSON.parse(storedParams)
          setUtmParams(parsed)
          console.log("UTM parameters loaded from storage:", parsed)
        }
      } catch (error) {
        console.warn("Error loading UTM parameters from storage:", error)
      }
    }
  }, [searchParams, utmParams]) // Include utmParams in dependencies but with proper comparison

  // Function to get UTM parameters as URL search params string
  const getUTMString = useCallback(() => {
    const params = new URLSearchParams()
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })
    return params.toString()
  }, [utmParams])

  // Function to append UTM parameters to a URL
  const appendUTMToUrl = useCallback(
    (url: string) => {
      const utmString = getUTMString()
      if (!utmString) return url

      const separator = url.includes("?") ? "&" : "?"
      return `${url}${separator}${utmString}`
    },
    [getUTMString],
  )

  return {
    utmParams,
    getUTMString,
    appendUTMToUrl,
  }
}
