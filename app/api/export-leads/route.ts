import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get leads from in-memory storage (in a real app, this would be from a database)
    // For this example, we'll import from the submit-lead route
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/submit-lead`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch leads")
    }

    const data = await response.json()
    const leads = data.leads || []

    // Convert leads to CSV
    const headers = ["Name", "Email", "Phone", "Timestamp"]
    const csvRows = [
      headers.join(","), // Header row
      ...leads.map((lead: any) => {
        return [
          lead.firstName || lead.name || "",
          lead.email || "",
          lead.phone || "",
          lead.timestamp || new Date().toISOString(),
        ]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`) // Escape quotes
          .join(",")
      }),
    ]

    const csv = csvRows.join("\n")

    // Return CSV as a downloadable file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ success: false, error: "Export failed" }, { status: 500 })
  }
}
