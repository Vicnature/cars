"use client";

import { useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity.client";
import { writeClient } from "@/lib/sanity.write";
import { PortableTextBlock } from "sanity";

export default function PaymentInstructionsPage() {
  const [instructions, setInstructions] = useState<string>("");
  const [docId, setDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const data = await sanityClient.fetch(`*[_type == "paymentInstructions"][0]{_id, instructions}`);
        if (data) {
          setDocId(data._id);
          setInstructions(data.instructions?.map((b: PortableTextBlock) => b.children?.[0]?.text).join("\n") || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructions();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const blocks = instructions.split("\n").filter(Boolean).map(line => ({
      _type: "block",
      children: [{ _type: "span", text: line }]
    }));

    const payload = { _type: "paymentInstructions", instructions: blocks };

    try {
      if (docId) {
        await writeClient.patch(docId).set(payload).commit();
      } else {
        await writeClient.create(payload);
      }
      alert("✅ Payment instructions updated.");
    } catch (err) {
      alert("❌ Failed to update instructions.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!docId) return;
    const confirmDelete = confirm("Are you sure you want to delete the instructions?");
    if (!confirmDelete) return;

    try {
      await writeClient.delete(docId);
      setDocId(null);
      setInstructions("");
      alert("🗑️ Instructions deleted.");
    } catch (err) {
      alert("❌ Failed to delete.");
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Payment Instructions</h1>
      <textarea
        className="w-full h-48 border p-3 rounded"
        value={instructions}
        onChange={e => setInstructions(e.target.value)}
        placeholder="Enter each step on a new line"
      />

      <div className="space-x-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Instructions"}
        </button>

        {docId && (
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Instructions
          </button>
        )}
      </div>
    </div>
  );
}
