"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RefreshCw } from "lucide-react"

interface Lead {
  firstName: string
  email: string
  phone: string
  timestamp: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to load leads from localStorage
  const loadLocalLeads = (): Lead[] => {
    try {
      const localLeads = localStorage.getItem("leadFormData")
      return localLeads ? JSON.parse(localLeads) : []
    } catch (e) {
      console.error("Error loading leads from localStorage:", e)
      return []
    }
  }

  // Function to try loading leads from API
  const loadApiLeads = async (): Promise<Lead[]> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      const response = await fetch("/api/submit-lead", {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      return data.leads || []
    } catch (e) {
      console.warn("Error loading leads from API:", e)
      return []
    }
  }

  // Function to load all leads
  const loadLeads = async () => {
    setLoading(true)
    setError(null)

    try {
      // Always load from localStorage
      const localLeads = loadLocalLeads()

      // Try to load from API, but don't block on failure
      let apiLeads: Lead[] = []
      try {
        apiLeads = await loadApiLeads()
      } catch (e) {
        console.warn("Failed to load API leads, continuing with local leads only")
      }

      // Combine leads from both sources, removing duplicates
      const allLeads = [...localLeads]

      // Add API leads that don't exist in local leads
      apiLeads.forEach((apiLead) => {
        const exists = localLeads.some(
          (localLead) => localLead.email === apiLead.email && localLead.phone === apiLead.phone,
        )

        if (!exists) {
          allLeads.push(apiLead)
        }
      })

      // Sort by timestamp, newest first
      allLeads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setLeads(allLeads)
    } catch (e) {
      console.error("Error loading leads:", e)
      setError("Failed to load leads. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Load leads on component mount
  useEffect(() => {
    loadLeads()
  }, [])

  // Function to export leads as CSV
  const exportCsv = () => {
    if (leads.length === 0) return

    // Create CSV content
    const headers = ["First Name", "Email", "Phone", "Timestamp"]
    const csvRows = [
      headers.join(","),
      ...leads.map((lead) =>
        [`"${lead.firstName}"`, `"${lead.email}"`, `"${lead.phone}"`, `"${lead.timestamp}"`].join(","),
      ),
    ]
    const csvContent = csvRows.join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `leads-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-[#0A0A0A] border border-[#7A5C2E]/30 text-white">
        <CardHeader>
          <CardTitle className="text-[#C7A052]">Lead Management</CardTitle>
          <CardDescription className="text-white/70">View and export all captured leads</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="animate-spin h-8 w-8 text-[#C7A052]" />
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-md text-white">{error}</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-white/70">No leads have been captured yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#7A5C2E]/30 hover:bg-[#7A5C2E]/10">
                    <TableHead className="text-[#C7A052]">Name</TableHead>
                    <TableHead className="text-[#C7A052]">Email</TableHead>
                    <TableHead className="text-[#C7A052]">Phone</TableHead>
                    <TableHead className="text-[#C7A052]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead, index) => (
                    <TableRow key={index} className="border-[#7A5C2E]/30 hover:bg-[#7A5C2E]/10">
                      <TableCell className="font-medium text-white">{lead.firstName}</TableCell>
                      <TableCell className="text-white/80">{lead.email}</TableCell>
                      <TableCell className="text-white/80">{lead.phone}</TableCell>
                      <TableCell className="text-white/60">{new Date(lead.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-[#7A5C2E]/30 pt-4">
          <Button
            variant="outline"
            onClick={loadLeads}
            className="border-[#7A5C2E] text-[#C7A052] hover:bg-[#7A5C2E]/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={exportCsv}
            disabled={leads.length === 0}
            className="bg-gradient-to-r from-[#7A5C2E] to-[#C7A052] hover:from-[#8B6B38] hover:to-[#D4AF61] text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-8 bg-[#0A0A0A] border border-[#7A5C2E]/30 text-white">
        <CardHeader>
          <CardTitle className="text-[#C7A052]">Webhook Setup Instructions</CardTitle>
          <CardDescription className="text-white/70">How to properly configure your n8n webhook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>To properly set up your n8n webhook for receiving leads, follow these steps:</p>
          <ol className="list-decimal pl-5 space-y-2 text-white/80">
            <li>Open your n8n workflow</li>
            <li>Add a "Webhook" node as the trigger</li>
            <li>
              Configure the webhook with the path:{" "}
              <code className="bg-black/30 px-2 py-1 rounded">b8862371-7217-4f8c-ab21-b06e9f098dcb</code>
            </li>
            <li>Set the authentication to "None" for testing</li>
            <li>
              <strong className="text-[#C7A052]">Important:</strong> Activate the workflow using the toggle in the
              top-right of the editor
            </li>
            <li>Test the webhook by sending a test request</li>
            <li>Once confirmed working, update the code to use the webhook</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
