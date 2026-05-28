import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import html2canvas from 'html2canvas';

// ==========================================
// APP 1: GRID_SYS (Brutalist Poster Creator)
// ==========================================
function BrutalistPosterCreator() {
  const [bgColor, setBgColor] = useState('#E5E5E5');
  const [textColor, setTextColor] = useState('#000000');
  const [borderColor, setBorderColor] = useState('#000000');

  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(4);
  const [gap, setGap] = useState(8);
  const [padding, setPadding] = useState(24);
  const [showGridLines, setShowGridLines] = useState(true);

  const [cellData, setCellData] = useState({});
  const [activeCell, setActiveCell] = useState(null);

  const posterRef = useRef(null);

  const presets = [
    { name: 'Concrete', bg: '#E5E5E5', text: '#000000', border: '#000000' },
    { name: 'Warning', bg: '#FF3300', text: '#000000', border: '#000000' },
    { name: 'Safety', bg: '#FFEA00', text: '#000000', border: '#000000' },
    { name: 'Blueprint', bg: '#0033FF', text: '#FFFFFF', border: '#FFFFFF' },
    { name: 'Void', bg: '#000000', text: '#FFFFFF', border: '#FFFFFF' },
  ];

  const handleCellChange = (key, field, value) => {
    setCellData((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleCellChange(key, 'imgUrl', url);
      handleCellChange(key, 'type', 'image');
    }
  };

  const handleExport = async () => {
    if (!posterRef.current) return;
    try {
      const btn = document.getElementById('export-poster-btn');
      if (btn) btn.innerText = 'RENDERING...';

      const canvas = await html2canvas(posterRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: bgColor,
      });

      const image = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.href = image;
      link.download = `GRID_SYS_${Date.now()}.jpg`;
      link.click();

      if (btn) btn.innerText = 'EXPORT JPG';
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate image. Check console.');
    }
  };

  const gridCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      gridCells.push(`${r}-${c}`);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-white text-black font-mono selection:bg-black selection:text-white">
      <style>{`
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* TOP: Massive Canvas Viewport */}
      <div className="flex-1 overflow-auto bg-zinc-200 border-b-4 border-black p-4 md:p-8 flex justify-center items-start inset-shadow">
        <div
          ref={posterRef}
          className="shadow-[16px_16px_0px_0px_rgba(0,0,0,0.15)] transition-colors relative overflow-hidden flex-shrink-0"
          style={{
            backgroundColor: bgColor,
            color: textColor,
            borderColor: borderColor,
            borderWidth: '4px',
            borderStyle: 'solid',
            padding: `${padding}px`,
            width: '100%',
            maxWidth: '650px',
            aspectRatio: '1 / 1.414',
          }}
        >
          <div className="w-full h-full grid grid-flow-row-dense"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gap: `${gap}px`,
            }}
          >
            {gridCells.map((key) => {
              const current = cellData[key];
              const isSelected = activeCell === key;
              const colSpan = current?.colSpan || 1;
              const rowSpan = current?.rowSpan || 1;
              const cellBorder = showGridLines ? `${borderColor}55` : 'transparent';

              return (
                <div key={key} onClick={() => setActiveCell(key)}
                  className={`relative group cursor-pointer overflow-hidden flex flex-col transition-all ${isSelected ? 'scale-[0.98] z-10' : ''}`}
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: isSelected ? borderColor : cellBorder,
                  }}
                >
                  <div className="w-full h-full flex p-3 pointer-events-none z-10 relative">
                    {!current?.type || current.type === 'text' ? (
                      <p className="font-sans font-bold leading-none tracking-tight whitespace-pre-wrap break-words"
                         style={{ fontSize: `${current?.fontSize || 16}px` }}>
                        {current?.text || ''}
                      </p>
                    ) : (
                      current?.imgUrl && <img src={current.imgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </div>
                  {!current?.text && !current?.imgUrl && showGridLines && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black opacity-20 text-current mix-blend-difference">+</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM: Dense Control Deck */}
      <div className="shrink-0 bg-[#f4f4f0] p-4 md:p-6 shadow-[0px_-8px_0px_0px_rgba(0,0,0,1)] z-20 max-h-[45vh] overflow-y-auto hide-scrollbar">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Col 1: Structure */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end border-b-2 border-black pb-1 mb-1">
              <h2 className="text-sm font-black uppercase">Structure</h2>
              <button onClick={() => setShowGridLines(!showGridLines)} className="text-[10px] font-bold bg-black text-white px-2 py-1 hover:bg-gray-800">
                {showGridLines ? 'HIDE GRID' : 'SHOW GRID'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-bold uppercase">Cols</label>
                <input type="number" min="1" max="12" value={columns} onChange={(e) => setColumns(parseInt(e.target.value) || 1)} className="w-full border-2 border-black p-1 text-sm font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase">Rows</label>
                <input type="number" min="1" max="12" value={rows} onChange={(e) => setRows(parseInt(e.target.value) || 1)} className="w-full border-2 border-black p-1 text-sm font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase">Gap ({gap})</label>
                <input type="range" min="0" max="40" value={gap} onChange={(e) => setGap(parseInt(e.target.value))} className="w-full accent-black" />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase">Pad ({padding})</label>
                <input type="range" min="0" max="80" value={padding} onChange={(e) => setPadding(parseInt(e.target.value))} className="w-full accent-black" />
              </div>
            </div>
          </div>

          {/* Col 2: Palette */}
          <div className="flex flex-col gap-3">
             <h2 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-1">Palette</h2>
             <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button key={p.name} onClick={() => { setBgColor(p.bg); setTextColor(p.text); setBorderColor(p.border); }} className="w-6 h-6 border-2 border-black hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: p.bg }} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[8px] font-bold uppercase block">BG</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-6 border-2 border-black cursor-pointer" />
              </div>
              <div>
                <label className="text-[8px] font-bold uppercase block">Text</label>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-6 border-2 border-black cursor-pointer" />
              </div>
              <div>
                <label className="text-[8px] font-bold uppercase block">Lines</label>
                <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-6 border-2 border-black cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Col 3: Cell Editor */}
          <div className="flex flex-col gap-3">
             <h2 className="text-sm font-black uppercase border-b-2 border-black pb-1 mb-1 flex justify-between">
               Cell Editor {activeCell && <span className="text-blue-600">[{activeCell}]</span>}
             </h2>
             {activeCell ? (
               <div className="grid grid-cols-2 gap-2">
                  <select value={cellData[activeCell]?.type || 'text'} onChange={(e) => handleCellChange(activeCell, 'type', e.target.value)} className="col-span-2 p-1 border-2 border-black text-[10px] font-bold">
                    <option value="text">TEXT</option>
                    <option value="image">IMAGE</option>
                  </select>
                  
                  {!cellData[activeCell]?.type || cellData[activeCell]?.type === 'text' ? (
                    <textarea value={cellData[activeCell]?.text || ''} onChange={(e) => handleCellChange(activeCell, 'text', e.target.value)} placeholder="Type..." rows="2" className="col-span-2 p-1 border-2 border-black text-xs resize-none" />
                  ) : (
                    <label className="col-span-2 border-2 border-black bg-white p-2 text-[10px] font-bold text-center cursor-pointer">
                      UPLOAD IMAGE <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, activeCell)} />
                    </label>
                  )}
                  <input type="number" placeholder="W-Span" value={cellData[activeCell]?.colSpan || 1} onChange={(e) => handleCellChange(activeCell, 'colSpan', parseInt(e.target.value))} className="border-2 border-black p-1 text-xs text-center" title="Width Span" />
                  <input type="number" placeholder="H-Span" value={cellData[activeCell]?.rowSpan || 1} onChange={(e) => handleCellChange(activeCell, 'rowSpan', parseInt(e.target.value))} className="border-2 border-black p-1 text-xs text-center" title="Height Span" />
               </div>
             ) : (
               <div className="h-full border-2 border-dashed border-gray-400 flex items-center justify-center text-[10px] text-gray-500 font-bold p-4 text-center">
                 Select a cell above to edit
               </div>
             )}
          </div>

          {/* Col 4: Export */}
          <div className="flex flex-col gap-3 justify-end">
            <button id="export-poster-btn" onClick={handleExport} className="w-full bg-[#FF3300] border-4 border-black p-4 text-black font-black uppercase tracking-widest hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
              Export JPG
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// APP 2: C_GEN (Interactive Component Foundry)
// ==========================================
function InteractiveComponentFoundry() {
  const [config, setConfig] = useState({
    shape: 'blob',
    anim: 'breathe',
    buttonColor: '#00FF41',
    textColor: '#000000',
    label: 'DRAG ME',
  });

  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  const p5Instance = useRef(null);

  const configRef = useRef(config);
  useEffect(() => { configRef.current = config; }, [config]);

  const presets = [
    { name: 'Warning', button: '#FF3300', text: '#000000' },
    { name: 'Blueprint', button: '#0033FF', text: '#FFFFFF' },
    { name: 'Safety', button: '#FFEA00', text: '#000000' },
    { name: 'Neon', button: '#00FF41', text: '#000000' },
    { name: 'Void', button: '#000000', text: '#FFFFFF' },
  ];
  const shapes = ['circle', 'rect', 'pill', 'blob'];
  const anims = ['breathe', 'glitch', 'elastic'];

  const randomizeAll = () => {
    const randomPalette = presets[Math.floor(Math.random() * presets.length)];
    setConfig({
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      anim: anims[Math.floor(Math.random() * anims.length)],
      buttonColor: randomPalette.button,
      textColor: randomPalette.text,
      label: 'SYS_' + Math.floor(Math.random() * 99),
    });
  };

  const generateReactCode = () => {
    let borderRadius = '0';
    if (config.shape === 'circle') borderRadius = '50%';
    if (config.shape === 'pill') borderRadius = '9999px';
    if (config.shape === 'blob') borderRadius = '40% 60% 70% 30% / 40% 50% 60% 50%';

    let animationStyle = config.anim === 'breathe' ? `@keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }` : '';
    
    const code = `
import React, { useState } from 'react';
/* ${animationStyle} */
export default function CustomBtn() {
  const [hover, setHover] = useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: '${config.buttonColor}', color: '${config.textColor}',
        borderRadius: '${borderRadius}', border: '4px solid #000',
        padding: '${config.shape === 'circle' ? '40px' : '20px 40px'}',
        width: '${config.shape === 'circle' ? '150px' : 'auto'}',
        height: '${config.shape === 'circle' ? '150px' : 'auto'}',
        fontWeight: 'bold', fontFamily: 'monospace', cursor: 'pointer',
        boxShadow: hover ? '6px 6px 0px #000' : '4px 4px 0px #000',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        transition: '${config.anim === 'elastic' ? 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'all 0.2s ease'}',
        animation: '${config.anim === 'breathe' && !hover ? 'breathe 3s infinite ease-in-out' : 'none'}',
      }}>
      {hover && '${config.anim}' === 'glitch' ? '${config.label.replace(/.$/, '@')}' : '${config.label}'}
    </button>
  );
}`.trim();

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // PRODUCTION FIX: Nuke any existing canvases inside the ref before starting
    canvasRef.current.innerHTML = '';

    const sketch = (p) => {
      let isHovered = false; let clickTime = 0; let time = 0;
      const NUM_NODES = 30; let blobNodes = [];

      p.setup = () => {
        // PRODUCTION FIX: Exact dimensions based on parent container
        const rect = canvasRef.current.getBoundingClientRect();
        const w = rect.width > 0 ? rect.width : 800;
        const h = rect.height > 0 ? rect.height : 500;
        
        p.createCanvas(w, h);
        p.rectMode(p.CENTER); p.imageMode(p.CENTER); p.textAlign(p.CENTER, p.CENTER);
        for (let i = 0; i < NUM_NODES; i++) blobNodes.push({ angle: p.map(i, 0, NUM_NODES, 0, p.TWO_PI), ox: 0, oy: 0 });
      };

      p.windowResized = () => {
        if(!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        if(rect.width > 0 && rect.height > 0) p.resizeCanvas(rect.width, rect.height);
      };

      const drawBlob = (xOff, yOff, width, height, color, isShadow) => {
        p.push(); p.translate(xOff, yOff); p.fill(color);
        if (isShadow) p.noStroke(); else { p.stroke(0); p.strokeWeight(4); }
        p.beginShape();
        let speed = isHovered ? 2 : 1;
        for (let i = 0; i < NUM_NODES + 3; i++) {
          let node = blobNodes[i % NUM_NODES];
          let nx = p.cos(node.angle) + 1; let ny = p.sin(node.angle) + 1;
          let n = p.noise(nx, ny, time * speed);
          let rX = (width / 2) * p.map(n, 0, 1, 0.8, 1.2);
          let rY = (height / 2) * p.map(n, 0, 1, 0.8, 1.2);
          p.curveVertex(rX * p.cos(node.angle) + node.ox, rY * p.sin(node.angle) + node.oy);
        }
        p.endShape(); p.pop();
      };

      p.draw = () => {
        const { shape, anim, buttonColor, textColor, label } = configRef.current;
        p.clear(); time += 0.05;

        const centerX = p.width / 2; const centerY = p.height / 2;
        const baseWidth = shape === 'circle' ? 140 : 180;
        const baseHeight = shape === 'circle' ? 140 : 60;

        if (p.mouseX > centerX - baseWidth/2 && p.mouseX < centerX + baseWidth/2 && p.mouseY > centerY - baseHeight/2 && p.mouseY < centerY + baseHeight/2) {
          if (!isHovered) { p.cursor(p.HAND); isHovered = true; }
        } else {
          if (isHovered) { p.cursor(p.ARROW); isHovered = false; }
        }
        if (p.mouseIsPressed && isHovered) clickTime = 1;

        let wMod = 0; let hMod = 0; let xOff = 0; let yOff = 0;
        const targetScale = isHovered ? 1.1 : 1.0;
        const clickScale = clickTime > 0 ? 0.9 : 1.0;

        if (anim === 'breathe') { wMod = p.sin(time)*10; hMod = p.cos(time)*5; }
        else if (anim === 'glitch' && isHovered) { xOff = p.random(-4,4); yOff = p.random(-4,4); if (p.random(1)>0.8) wMod = p.random(-20,20); }
        else if (anim === 'elastic') { wMod = isHovered ? p.sin(time*3)*15 : 0; }
        if (clickTime > 0) clickTime -= 0.1;

        const fW = (baseWidth + wMod) * targetScale * clickScale;
        const fH = (baseHeight + hMod) * targetScale * clickScale;

        if (shape === 'blob') {
          for (let i = 0; i < NUM_NODES; i++) {
            let node = blobNodes[i];
            let n = p.noise(p.cos(node.angle)+1, p.sin(node.angle)+1, time*(isHovered?2:1));
            let absX = centerX + xOff + ((fW/2)*p.map(n,0,1,0.8,1.2)*p.cos(node.angle)) + node.ox;
            let absY = centerY + yOff + ((fH/2)*p.map(n,0,1,0.8,1.2)*p.sin(node.angle)) + node.oy;
            if (p.mouseIsPressed && isHovered) {
              let dx = p.mouseX - absX; let dy = p.mouseY - absY;
              if (p.sqrt(dx*dx + dy*dy) < 100) { node.ox += dx*0.1; node.oy += dy*0.1; }
            }
            node.ox += (0 - node.ox) * 0.15; node.oy += (0 - node.oy) * 0.15;
          }
        }

        p.push(); p.translate(centerX + xOff, centerY + yOff);
        if (shape === 'blob') drawBlob(6, 6, fW, fH, '#000000', true);
        else { p.fill(0); p.noStroke(); shape==='circle'?p.circle(6,6,fW):shape==='pill'?p.rect(6,6,fW,fH,fH/2):p.rect(6,6,fW,fH); }
        
        if (shape === 'blob') drawBlob(0, 0, fW, fH, buttonColor, false);
        else { p.fill(buttonColor); p.stroke(0); p.strokeWeight(4); shape==='circle'?p.circle(0,0,fW):shape==='pill'?p.rect(0,0,fW,fH,fH/2):p.rect(0,0,fW,fH); }

        p.fill(textColor); p.noStroke(); p.textSize(16); p.textStyle(p.BOLD); p.textFont('monospace');
        if (anim === 'glitch' && isHovered && p.random(1)>0.7) p.text(label.substring(0, label.length-1)+'@', p.random(-2,2), p.random(-2,2));
        else p.text(label, 0, 0);
        p.pop();
      };
    };

    p5Instance.current = new p5(sketch, canvasRef.current);
    return () => { if (p5Instance.current) { p5Instance.current.remove(); p5Instance.current = null; } };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-white text-black font-mono selection:bg-black selection:text-white">
      {/* TOP: Massive Canvas Viewport */}
      <div className="flex-1 overflow-hidden bg-zinc-200 border-b-4 border-black relative flex justify-center items-center inset-shadow">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-[10px] font-black uppercase z-20 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">Canvas.render()</div>
        <button onClick={randomizeAll} className="absolute top-4 right-4 bg-[#FFEA00] border-2 border-black px-4 py-1 text-[10px] font-black uppercase z-20 hover:scale-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform">
           Generate Random
        </button>
        {/* Full width/height container for p5 to safely bind to */}
        <div ref={canvasRef} className="w-full h-full z-10" />
      </div>

      {/* BOTTOM: Dense Control Deck */}
      <div className="shrink-0 bg-white p-4 md:p-6 shadow-[0px_-8px_0px_0px_rgba(0,0,0,1)] z-20 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-black uppercase border-b-2 border-black pb-1">Shape & Motion</h2>
            <div className="flex gap-2">
              {shapes.map(s => <button key={s} onClick={() => setConfig({...config, shape: s})} className={`flex-1 border-2 border-black p-1 text-[10px] font-bold uppercase ${config.shape === s ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}>{s}</button>)}
            </div>
            <div className="flex gap-2 mt-1">
              {anims.map(a => <button key={a} onClick={() => setConfig({...config, anim: a})} className={`flex-1 border-2 border-black p-1 text-[10px] font-bold uppercase ${config.anim === a ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}>{a}</button>)}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-black uppercase border-b-2 border-black pb-1">Material & Ink</h2>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => <button key={p.name} onClick={() => setConfig({...config, buttonColor: p.button, textColor: p.text})} className="w-5 h-5 border-2 border-black hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: p.button }}/>)}
            </div>
            <div className="flex gap-2 mt-1">
               <input type="color" value={config.buttonColor} onChange={e => setConfig({...config, buttonColor: e.target.value})} className="w-full h-6 border-2 border-black cursor-pointer" title="Button Background" />
               <input type="color" value={config.textColor} onChange={e => setConfig({...config, textColor: e.target.value})} className="w-full h-6 border-2 border-black cursor-pointer" title="Text Color" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-black uppercase border-b-2 border-black pb-1">Label Content</h2>
            <input type="text" value={config.label} onChange={e => setConfig({...config, label: e.target.value.toUpperCase()})} maxLength={12} className="w-full bg-zinc-100 border-2 border-black p-2 text-sm font-bold focus:outline-none focus:bg-black focus:text-white uppercase" />
          </div>

          <div className="flex flex-col justify-end">
             <button onClick={generateReactCode} className={`w-full border-4 border-black p-3 font-black uppercase tracking-widest text-xs transition-all ${copied ? 'bg-black text-white' : 'bg-[#00FF41] text-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none'}`}>
              {copied ? 'Copied to Clipboard!' : '</> Copy React Code'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// MASTER APP: PLYGRND (Router)
// ==========================================
export default function PLYGRND() {
  const [activeTab, setActiveTab] = useState('poster');

  return (
    <div className="min-h-screen h-screen overflow-hidden bg-zinc-100 flex flex-col font-mono selection:bg-black selection:text-white">
      <header className="h-[80px] bg-[#FFEA00] border-b-4 border-black flex items-center justify-between px-4 md:px-8 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black"></div>
          </div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mt-1">PLYGRND.</h1>
        </div>

        <div className="flex gap-2 md:gap-4">
          <button onClick={() => setActiveTab('poster')} className={`px-3 md:px-6 py-2 border-2 border-black font-bold uppercase text-[10px] md:text-sm transition-all ${activeTab === 'poster' ? 'bg-black text-white translate-y-1 shadow-none' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'}`}>Grid_Sys</button>
          <button onClick={() => setActiveTab('foundry')} className={`px-3 md:px-6 py-2 border-2 border-black font-bold uppercase text-[10px] md:text-sm transition-all ${activeTab === 'foundry' ? 'bg-black text-white translate-y-1 shadow-none' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1'}`}>C_Gen</button>
        </div>
      </header>

      <main className="flex-1 w-full bg-zinc-100 relative">
        {activeTab === 'poster' ? <BrutalistPosterCreator /> : <InteractiveComponentFoundry />}
      </main>
    </div>
  );
}