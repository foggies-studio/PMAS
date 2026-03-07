/** ================================
 *  Export PDF (screenshot)
 *  ================================ */
document.getElementById("btnPDF").addEventListener("click", exportPDF);

async function exportPDF(){
  try{
    const { jsPDF } = window.jspdf;
    const capture = await html2canvas(document.body, { scale: 2 });
    const imgData = capture.toDataURL("image/png");
    const pdf = new jsPDF("p","mm","a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = capture.height * w / capture.width;
    pdf.addImage(imgData, "PNG", 0, 0, w, h);
    pdf.save("PMAS_Report.pdf");
  }catch(err){
    console.error(err);
    alert("Не удалось экспортировать PDF.");
  }
}

/** ================================
 *  Export DOCX (fixed)
 *  ================================ */
document.getElementById("btnDOCX").addEventListener("click", exportDOCX);

async function exportDOCX(){
  try{
    if(typeof docx === "undefined"){
      alert("Библиотека docx не загрузилась (проверьте интернет).");
      return;
    }
    const { Document, Packer, Paragraph, TextRun } = docx;

    const patient = document.getElementById("patientName").value || "—";
    const date = document.getElementById("examDate").value || "—";
    const procedure = document.getElementById("procedure")?.value || "—";
    const goal = document.getElementById("goal")?.value || "—";
    const notes = document.getElementById("notes")?.value || "—";

    const lines = [];
    let H=null, L=null;
    for(const key of Object.keys(measurements)){
      const m = measurements[key];
      const px = distPx(m.p1, m.p2);
      const mm = scaleMMperPx ? px * scaleMMperPx : null;
      lines.push(`${key}: ${mm ? mm.toFixed(2)+' мм' : px.toFixed(2)+' px'}`);
      if(key==="H") H = mm;
      if(key==="L") L = mm;
    }
    const AB = (H!=null && L!=null) ? Math.sqrt(H*H + L*L) : null;

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children:[ new TextRun({ text:"PMAS Clinical Protocol", bold:true, size:28 }) ] }),
          new Paragraph({ children:[ new TextRun({ text:`Пациент: ${patient}`, size:24 }) ] }),
          new Paragraph({ children:[ new TextRun({ text:`Дата: ${date}`, size:24 }) ] }),
          new Paragraph(""),
          new Paragraph({ children:[ new TextRun({ text:"Измерения:", bold:true }) ] }),
          ...lines.map(t => new Paragraph(t)),
          new Paragraph(""),
          new Paragraph({ children:[ new TextRun({ text:"План операции:", bold:true }) ] }),
          new Paragraph({ children:[ new TextRun({ text:`Процедура: ${procedure}` }) ] }),
          new Paragraph({ children:[ new TextRun({ text:`Цель: ${goal}` }) ] }),
          ...planItems.map(it => new Paragraph(`${it.type==="vector"?"Вектор":it.type==="tilt"?"Наклон":it.type==="angle3"?"Клинич. угол":it.type==="guide"?"Линия":"Измерение"} • ${it.label}: ${it.mm!=null?it.mm.toFixed(2)+" мм":it.px.toFixed(1)+" px"}${it.deg!=null?" • "+it.deg.toFixed(1)+"°":""}`)),
          ...planZones.map(z => {
            const areaPx2 = polygonAreaPx2(z.points);
            const areaMm2 = (scaleMMperPx ? areaPx2 * scaleMMperPx * scaleMMperPx : null);
            const cen = polygonCentroid(z.points);
            const shiftPx = (z.liftTo ? distPx(cen, z.liftTo) : 0);
            const shiftMm = (scaleMMperPx ? shiftPx * scaleMMperPx : null);
            const aTxt = areaMm2!=null ? (areaMm2/100.0).toFixed(2)+" см²" : areaPx2.toFixed(0)+" px²";
            const sTxt = (z.liftTo ? (shiftMm!=null ? shiftMm.toFixed(2)+" мм" : shiftPx.toFixed(1)+" px") : "—");
            return new Paragraph(`Зона • ${z.label}: площадь ${aTxt} • смещение ${sTxt}`);
          }),
          new Paragraph(""),
          new Paragraph({ children:[ new TextRun({ text:"Заметки:", bold:true }) ] }),
          new Paragraph(notes),
          new Paragraph(""),
          new Paragraph({ children:[ new TextRun({ text:`AB = √(H² + L²): ${AB!=null ? AB.toFixed(2)+" мм" : "—"}`, bold:true }) ] }),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const safePatient = (patient||"").replace(/[^a-zA-Z0-9а-яА-Я _-]+/g,"").trim() || "Patient";
    const safeDate = (date||"").replace(/[^0-9.-]+/g,"").trim() || "";
    const fname = `PMAS_Protocol_${safePatient}${safeDate?("_"+safeDate):""}.docx`;
    // Robust download: use FileSaver if available (better across browsers), otherwise fallback to <a download>.
    if(typeof saveAs !== "undefined"){
      saveAs(blob, fname);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url), 2000);
    }
  }catch(err){
    console.error(err);
    alert("Не удалось экспортировать DOCX: " + (err?.message || err));
  }
}

