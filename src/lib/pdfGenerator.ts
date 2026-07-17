import { jsPDF } from "jspdf";
import { RecommendationResponse } from "../types";

interface PatientMetadata {
  name?: string;
  email?: string;
  age: string | number;
  gender: string;
  symptoms: string[];
  severity: string;
  duration?: string;
  customDescription?: string;
}

export function generateAyurvedicPDF(
  result: RecommendationResponse,
  meta: PatientMetadata
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let pageNum = 1;

  // Add a helper for drawing clean footers
  const drawFooter = (d: jsPDF, pNum: number) => {
    d.setFont("helvetica", "italic");
    d.setFontSize(8);
    d.setTextColor(140, 140, 140);
    d.text(
      "VedaScan Ayurvedic AI Platform - For clinical informational reference only.",
      20,
      287
    );
    d.text(`Page ${pNum}`, 190, 287, { align: "right" });
  };

  // Helper for adding headers
  const drawHeader = (d: jsPDF) => {
    d.setFont("helvetica", "bold");
    d.setFontSize(16);
    d.setTextColor(197, 163, 107); // Gold Sand color
    d.text("VEDASCAN AYURVEDIC CLINICAL PROTOCOL", 20, 20);
    
    d.setFont("helvetica", "normal");
    d.setFontSize(8);
    d.setTextColor(100, 100, 100);
    d.text("AUTHENTIC TRADITIONAL AI VAIDYA RECONSTRUCTION ENGINE", 20, 24);

    d.setDrawColor(197, 163, 107);
    d.setLineWidth(0.5);
    d.line(20, 27, 190, 27);
  };

  drawHeader(doc);
  drawFooter(doc, pageNum);

  let y = 35;

  const printText = (
    text: string,
    fontSize: number = 10,
    fontStyle: "normal" | "bold" | "italic" = "normal",
    color: [number, number, number] = [40, 40, 40],
    lineSpacing: number = 5
  ) => {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines: string[] = doc.splitTextToSize(text, 170);
    for (const line of lines) {
      if (y > 270) {
        doc.addPage();
        pageNum++;
        drawHeader(doc);
        drawFooter(doc, pageNum);
        y = 35;
        // Restore font settings after new page header reset
        doc.setFont("helvetica", fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
      }
      doc.text(line, 20, y);
      y += lineSpacing;
    }
  };

  const addSpace = (amount: number) => {
    y += amount;
    if (y > 270) {
      doc.addPage();
      pageNum++;
      drawHeader(doc);
      drawFooter(doc, pageNum);
      y = 35;
    }
  };

  // 1. Demographics & Context
  printText("1. PATIENT DIAGNOSTIC FILE METADATA", 11, "bold", [197, 163, 107]);
  addSpace(1);

  // Demographic table/grid styling
  const metaLines = [
    `Name / Identity: ${meta.name || "Anonymous Patient"}`,
    `Contact / Email: ${meta.email || "N/A"}`,
    `Demographics: ${meta.age} Years Old / Gender: ${meta.gender}`,
    `Presenting Symptoms: ${meta.symptoms.join(", ") || "General Wellness Inquiry"}`,
    `Severity Index: ${meta.severity.toUpperCase()} / Duration: ${meta.duration || "N/A"}`,
  ];

  metaLines.forEach((ln) => {
    printText(ln, 9.5, "normal", [80, 80, 80], 4.5);
  });

  if (meta.customDescription) {
    addSpace(2);
    printText("Clinical Notes / Self-Narrative:", 9.5, "bold", [80, 80, 80]);
    printText(`"${meta.customDescription}"`, 9, "italic", [110, 110, 110]);
  }

  addSpace(5);

  // 2. Warning Label (if present)
  if (result.warning) {
    printText("⚠️ SAFETY ALERT & ADVISORY NOTICE", 11, "bold", [217, 119, 6]);
    printText(result.warning, 9, "normal", [217, 119, 6], 4.5);
    addSpace(5);
  }

  // 3. Dosha Aggravation Analysis
  printText("2. DOSHA CONSTITUTIONAL AGGRAVATION ANALYSIS", 11, "bold", [197, 163, 107]);
  addSpace(1);
  printText(result.dominantDoshaAnalysis, 10, "normal", [40, 40, 40]);
  addSpace(5);

  // 4. Holistic Action Plan
  printText("3. CLINICAL SUMMARY & ACTION PLAN", 11, "bold", [197, 163, 107]);
  addSpace(1);
  printText(result.holisticSummary, 10, "normal", [40, 40, 40]);
  addSpace(5);

  // 5. Recommended Herbal Formulations
  printText("4. SPECIFIC HERBAL REMEDIATION COMBINATIONS", 11, "bold", [197, 163, 107]);
  addSpace(2);

  if (result.medicines && result.medicines.length > 0) {
    result.medicines.forEach((med, idx) => {
      printText(`${idx + 1}. ${med.name} (${med.sanskritName || "Sanskrit Unknown"})`, 10, "bold", [40, 40, 40]);
      printText(`• Classification / Category: ${med.type}`, 9, "normal", [80, 80, 80], 4);
      printText(`• Therapeutic Benefits: ${med.benefits}`, 9, "normal", [80, 80, 80], 4);
      printText(`• Dose Posology & Timing: ${med.dosageInstructions}`, 9, "normal", [80, 80, 80], 4);
      printText(`• Safety Warnings / Contraindications: ${med.safetyNotes}`, 9, "normal", [80, 80, 80], 4);
      addSpace(3);
    });
  } else {
    printText("No specific botanical formulas recommended. Rely on general lifestyle balancing remedies.", 10, "italic", [100, 100, 100]);
    addSpace(3);
  }

  addSpace(3);

  // 6. Dietary Guidelines
  printText("5. DIETARY PROTOCOLS & PATHYA RECOMMENDATIONS", 11, "bold", [197, 163, 107]);
  addSpace(1);
  printText(result.dietaryRecommendations.explanation, 9.5, "normal", [40, 40, 40]);
  addSpace(2);

  printText("✔ DIETARY ACCENTS TO FAVOR (PATHYA):", 9.5, "bold", [16, 124, 65]);
  result.dietaryRecommendations.toFavor.forEach((food) => {
    printText(`  • ${food}`, 9, "normal", [60, 60, 60], 4);
  });
  addSpace(2);

  printText("✘ SUBSTANCES TO ENTIRELY AVOID (APATHYA):", 9.5, "bold", [220, 38, 38]);
  result.dietaryRecommendations.toAvoid.forEach((food) => {
    printText(`  • ${food}`, 9, "normal", [60, 60, 60], 4);
  });
  addSpace(5);

  // 7. Lifestyle & Vihara Guidelines
  printText("6. DAILY VIHARA & BEHAVIORAL PROTOCOL (LIFESTYLE)", 11, "bold", [197, 163, 107]);
  addSpace(2);

  printText("🧘 Recommended Yoga Asanas & Postures:", 9.5, "bold", [40, 40, 40]);
  result.lifestyleRecommendations.yogaAsanas.forEach((pose) => {
    printText(`  • ${pose}`, 9, "normal", [60, 60, 60], 4);
  });
  addSpace(2);

  printText("🫁 Pranayama & Breathing Exercises:", 9.5, "bold", [40, 40, 40]);
  result.lifestyleRecommendations.breathingExercises.forEach((ex) => {
    printText(`  • ${ex}`, 9, "normal", [60, 60, 60], 4);
  });
  addSpace(2);

  printText("📝 Everyday Ayurvedic Lifestyle Tips:", 9.5, "bold", [40, 40, 40]);
  result.lifestyleRecommendations.lifestyleTips.forEach((tip) => {
    printText(`  • ${tip}`, 9, "normal", [60, 60, 60], 4);
  });

  addSpace(8);

  // Clinical Sign-off
  printText("----------------------------------------------------------------------------------------------------", 8, "normal", [180, 180, 180], 4);
  printText("AUTHORIZATION & CLINICAL DISCLAIMER:", 9, "bold", [100, 100, 100]);
  printText(
    "This diagnostics plan was compiled programmatically using VedaScan's digital Ayurvedic reasoning engine and generative models mapping authentic Shastras. It does not replace formal medical consultations. Seek guidance from your healthcare team before beginning herbal therapies.",
    8,
    "italic",
    [120, 120, 120],
    4
  );

  // Save the PDF
  const filename = `VedaScan_Ayurvedic_Protocol_${meta.name ? meta.name.replace(/\s+/g, "_") : "Report"}.pdf`;
  doc.save(filename);
}
