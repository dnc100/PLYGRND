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

  const [cellData, setCellData] = useState({});
  const [activeCell, setActiveCell] = useState(null);

  const posterRef = useRef(null);

  const presets = [
    { name: 'Concrete', bg: '#E5E5E5', text: '#000000', border: '#000000' },
    { name: 'Warning Red', bg: '#FF3300', text: '#000000', border: '#000000' },
    { name: 'Safety Yellow', bg: '#FFEA00', text: '#000000', border: '#000000' },
    { name: 'Blueprint', bg: '#0033FF', text: '#FFFFFF', border: '#FFFFFF' },
    { name: 'Void', bg: '#000000', text: '#FFFFFF', border: '#FFFFFF' },
    { name: 'Terminal', bg: '#000000', text: '#00FF41', border: '#00FF41' },
  ];

  const handleCellChange = (key, field, value) => {
    setCellData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
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
      // Temporarily change button text for UX feedback
      const btn = document.getElementById('export-btn');
      if (btn) btn.innerText = 'RENDERING...';

      const canvas = await html2canvas(posterRef.current, {
        scale: 3, // Multiplies resolution for high-quality export
        useCORS: true, // Allows uploaded local images to be rendered
        backgroundColor: bgColor, // Enforces your custom background
      });

      // Convert canvas to JPG data URL
      const image = canvas.toDataURL('image/jpeg', 0.9);

      // Trigger automatic download
      const link = document.createElement('a');
      link.href = image;
      link.download = `GRID_SYS_${Date.now()}.jpg`;
      link.click();

      if (btn) btn.innerText = 'Export JPG';
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
    <div className="min-h-[calc(100vh-80px)] w-full bg-white text-black font-mono p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 selection:bg-black selection:text-white screen-only">
      <style>{`
        @media print {
          body * { visibility: hidden; background: none; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { 
            position: absolute; left: 0; top: 0; 
            width: 100% !important; height: 100% !important; 
            padding: 0 !important; margin: 0 !important;
          }
          .screen-only { display: none !important; }
        }
        .brutal-btn {
          border: 3px solid black;
          box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);
          transition: all 0.1s ease-in-out;
        }
        .brutal-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
        }
        .brutal-btn:active {
          transform: translate(6px, 6px);
          box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
        }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; }
      `}</style>

      <div className="bg-[#f4f4f0] border-4 border-black p-4 md:p-6 flex flex-col gap-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] screen-only overflow-y-auto">
        <div className="border-b-4 border-black pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">
              Grid_Sys
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest">
              v2.1 // Advanced Layout
            </p>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-black rounded-full"></div>
            <div className="w-4 h-4 bg-black"></div>
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-black"></div>
          </div>
        </div>

        <div className="border-4 border-black p-4 bg-white relative">
          <div className="absolute -top-3 left-2 bg-white px-2 text-[10px] font-black uppercase border-2 border-black">
            Structure
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label className="text-[10px] font-bold uppercase block mb-1">Cols (X)</label>
              <input type="number" min="1" max="12" value={columns} onChange={(e) => setColumns(parseInt(e.target.value) || 1)} className="w-full bg-[#f4f4f0] border-2 border-black p-2 font-bold text-lg focus:outline-none focus:bg-black focus:text-white transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase block mb-1">Rows (Y)</label>
              <input type="number" min="1" max="12" value={rows} onChange={(e) => setRows(parseInt(e.target.value) || 1)} className="w-full bg-[#f4f4f0] border-2 border-black p-2 font-bold text-lg focus:outline-none focus:bg-black focus:text-white transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase block mb-1">Gap ({gap}px)</label>
              <input type="range" min="0" max="40" value={gap} onChange={(e) => setGap(parseInt(e.target.value))} className="w-full accent-black" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase block mb-1">Pad ({padding}px)</label>
              <input type="range" min="0" max="80" value={padding} onChange={(e) => setPadding(parseInt(e.target.value))} className="w-full accent-black" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest">Palette System</label>
          <div className="flex flex-wrap gap-3 mb-2">
            {presets.map((p) => (
              <button key={p.name} onClick={() => { setBgColor(p.bg); setTextColor(p.text); setBorderColor(p.border); }} className="w-8 h-8 border-2 hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: p.bg, borderColor: p.border === '#FFFFFF' ? '#000000' : p.border }} title={p.name} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col">
              <label className="text-[8px] font-bold uppercase mb-1">Canvas</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 border-2 border-black cursor-pointer" />
            </div>
            <div className="flex flex-col">
              <label className="text-[8px] font-bold uppercase mb-1">Text</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-8 border-2 border-black cursor-pointer" />
            </div>
            <div className="flex flex-col">
              <label className="text-[8px] font-bold uppercase mb-1">Borders</label>
              <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-8 border-2 border-black cursor-pointer" />
            </div>
          </div>
        </div>

        {activeCell ? (
          <div className="border-4 border-black p-4 bg-[#FFEA00] relative">
            <div className="absolute -top-3 left-2 bg-white px-2 text-[10px] font-black uppercase border-2 border-black">Edit Cell [{activeCell}]</div>
            <button onClick={() => setActiveCell(null)} className="absolute top-2 right-2 text-xl font-black leading-none hover:text-white">✕</button>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="text-[10px] font-bold uppercase block">Width (Span)</label>
                  <input type="number" min="1" max={columns} value={cellData[activeCell]?.colSpan || 1} onChange={(e) => handleCellChange(activeCell, 'colSpan', parseInt(e.target.value))} className="w-full border-2 border-black p-1 font-bold text-center" />
                </div>
                <div className="w-1/2">
                  <label className="text-[10px] font-bold uppercase block">Height (Span)</label>
                  <input type="number" min="1" max={rows} value={cellData[activeCell]?.rowSpan || 1} onChange={(e) => handleCellChange(activeCell, 'rowSpan', parseInt(e.target.value))} className="w-full border-2 border-black p-1 font-bold text-center" />
                </div>
              </div>

              <div>
                <select value={cellData[activeCell]?.type || 'text'} onChange={(e) => handleCellChange(activeCell, 'type', e.target.value)} className="w-full p-2 border-2 border-black font-bold uppercase text-xs cursor-pointer">
                  <option value="text">TEXT BLOCK</option>
                  <option value="image">IMAGE BLOCK</option>
                </select>
              </div>

              {!cellData[activeCell]?.type || cellData[activeCell]?.type === 'text' ? (
                <>
                  <textarea value={cellData[activeCell]?.text || ''} onChange={(e) => handleCellChange(activeCell, 'text', e.target.value)} placeholder="TYPE HERE..." rows="3" className="w-full p-2 border-2 border-black text-sm font-sans resize-none focus:outline-none" />
                  <div>
                    <label className="text-[10px] font-bold uppercase block mb-1">Text Size ({cellData[activeCell]?.fontSize || 16}px)</label>
                    <input type="range" min="10" max="120" value={cellData[activeCell]?.fontSize || 16} onChange={(e) => handleCellChange(activeCell, 'fontSize', parseInt(e.target.value))} className="w-full accent-black" />
                  </div>
                </>
              ) : (
                <div className="border-2 border-black bg-white p-2">
                  <label className="text-[10px] font-bold uppercase block mb-2 cursor-pointer hover:underline">
                    + Choose Local File
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, activeCell)} />
                  </label>
                  <p className="text-[8px] text-gray-500 break-all">{cellData[activeCell]?.imgUrl ? 'Image Loaded.' : 'No file selected.'}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border-4 border-black border-dashed p-8 text-center text-gray-400 font-bold uppercase text-xs">Select a cell on the canvas to inject content</div>
        )}

        <button onClick={handleExport} className="brutal-btn mt-auto w-full bg-[#FF3300] text-black py-4 text-sm font-black tracking-widest uppercase">Print / Export</button>
      </div>

      <div className="w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)] flex justify-center items-center overflow-auto p-4 md:p-8 bg-zinc-100 border-2 border-black inset-shadow">
        <div ref={posterRef} className="print-area shadow-[16px_16px_0px_0px_rgba(0,0,0,0.1)] transition-colors relative overflow-hidden flex-shrink-0" style={{ backgroundColor: bgColor, color: textColor, borderColor: borderColor, borderWidth: '4px', borderStyle: 'solid', padding: `${padding}px`, width: '100%', maxWidth: '600px', aspectRatio: '1 / 1.414' }}>
          <div className="w-full h-full grid grid-flow-row-dense" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`, gap: `${gap}px` }}>
            {gridCells.map((key) => {
              const current = cellData[key];
              const isSelected = activeCell === key;
              const colSpan = current?.colSpan || 1;
              const rowSpan = current?.rowSpan || 1;

              return (
                <div key={key} onClick={() => setActiveCell(key)} className={`relative group cursor-pointer overflow-hidden flex flex-col transition-transform ${isSelected ? 'scale-[0.98]' : ''}`} style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}`, borderWidth: '2px', borderStyle: 'solid', borderColor: isSelected ? borderColor : `${borderColor}66` }}>
                  <div className="w-full h-full flex p-3 pointer-events-none z-10 relative">
                    {!current?.type || current.type === 'text' ? (
                      <p className="font-sans font-bold leading-none tracking-tight whitespace-pre-wrap break-words" style={{ fontSize: `${current?.fontSize || 16}px` }}>{current?.text || ''}</p>
                    ) : (
                      current?.imgUrl && <img src={current.imgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </div>
                  {!current?.text && !current?.imgUrl && <span className="screen-only absolute inset-0 flex items-center justify-center text-[10px] font-black opacity-30 text-current mix-blend-difference">+</span>}
                </div>
              );
            })}
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
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const presets = [
    { name: 'Warning', button: '#FF3300', text: '#000000' },
    { name: 'Blueprint', button: '#0033FF', text: '#FFFFFF' },
    { name: 'Safety', button: '#FFEA00', text: '#000000' },
    { name: 'Void', button: '#000000', text: '#FFFFFF' },
    { name: 'Neon', button: '#00FF41', text: '#000000' },
    { name: 'Cyber', button: '#FF00FF', text: '#FFFFFF' },
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
      label: 'SYSTEM_0' + Math.floor(Math.random() * 9),
    });
  };

  const generateReactCode = () => {
    let borderRadius = '0';
    if (config.shape === 'circle') borderRadius = '50%';
    if (config.shape === 'pill') borderRadius = '9999px';
    if (config.shape === 'blob') borderRadius = '40% 60% 70% 30% / 40% 50% 60% 50%';

    let animationStyle = '';
    let hoverTransform = 'scale(1.05)';

    if (config.anim === 'breathe') {
      animationStyle = `@keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`;
      hoverTransform = 'scale(1.1)';
    }

    const code = `
import React, { useState } from 'react';

/**
 * Auto-generated by Component_Gen
 * Note: Add the CSS keyframes below to your stylesheet if using complex animations.
 * ${animationStyle}
 */
export default function CustomInteractiveButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '${config.buttonColor}',
        color: '${config.textColor}',
        borderRadius: '${borderRadius}',
        border: '4px solid #000',
        padding: '${config.shape === 'circle' ? '40px' : '20px 40px'}',
        width: '${config.shape === 'circle' ? '150px' : 'auto'}',
        height: '${config.shape === 'circle' ? '150px' : 'auto'}',
        fontWeight: 'bold',
        fontSize: '16px',
        fontFamily: 'monospace',
        cursor: 'pointer',
        boxShadow: isHovered ? '6px 6px 0px #000' : '4px 4px 0px #000',
        transform: isHovered ? '${hoverTransform}' : 'scale(1)',
        transition: '${config.anim === 'elastic' ? 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'all 0.2s ease'}',
        animation: '${config.anim === 'breathe' && !isHovered ? 'breathe 3s infinite ease-in-out' : 'none'}',
      }}
    >
      {isHovered && '${config.anim}' === 'glitch' ? '${config.label.replace(/.$/, '@')}' : '${config.label}'}
    </button>
  );
}
    `.trim();

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // FIX 1: Safety check. If DOM is not ready, abort p5 initialization.
    if (!canvasRef.current) return;

    const sketch = (p) => {
      let isHovered = false;
      let clickTime = 0;
      let time = 0;

      const NUM_NODES = 30;
      let blobNodes = [];

      p.setup = () => {
        // Safe dimensions calculation
        const canvasWidth = p.windowWidth > 800 ? 600 : 340;
        p.createCanvas(canvasWidth, 400);
        p.rectMode(p.CENTER);
        p.imageMode(p.CENTER);
        p.textAlign(p.CENTER, p.CENTER);

        for (let i = 0; i < NUM_NODES; i++) {
          blobNodes.push({ angle: p.map(i, 0, NUM_NODES, 0, p.TWO_PI), ox: 0, oy: 0 });
        }
      };

      const drawBlob = (xOff, yOff, width, height, color, isShadow) => {
        p.push();
        p.translate(xOff, yOff);
        p.fill(color);
        if (isShadow) p.noStroke();
        else { p.stroke(0); p.strokeWeight(4); }

        p.beginShape();
        let speed = isHovered ? 2 : 1;

        for (let i = 0; i < NUM_NODES + 3; i++) {
          let node = blobNodes[i % NUM_NODES];
          let angle = node.angle;
          let nx = p.cos(angle) + 1;
          let ny = p.sin(angle) + 1;
          let n = p.noise(nx, ny, time * speed);
          let rX = (width / 2) * p.map(n, 0, 1, 0.8, 1.2);
          let rY = (height / 2) * p.map(n, 0, 1, 0.8, 1.2);
          p.curveVertex(rX * p.cos(angle) + node.ox, rY * p.sin(angle) + node.oy);
        }
        p.endShape();
        p.pop();
      };

      p.draw = () => {
        const { shape, anim, buttonColor, textColor, label } = configRef.current;
        p.clear();
        time += 0.05;

        const centerX = p.width / 2;
        const centerY = p.height / 2;
        const baseWidth = shape === 'circle' ? 140 : 180;
        const baseHeight = shape === 'circle' ? 140 : 60;

        if (p.mouseX > centerX - baseWidth / 2 && p.mouseX < centerX + baseWidth / 2 && p.mouseY > centerY - baseHeight / 2 && p.mouseY < centerY + baseHeight / 2) {
          if (!isHovered) { p.cursor(p.HAND); isHovered = true; }
        } else {
          if (isHovered) { p.cursor(p.ARROW); isHovered = false; }
        }

        if (p.mouseIsPressed && isHovered) clickTime = 1;

        let widthMod = 0; let heightMod = 0; let xOffset = 0; let yOffset = 0;
        const targetScale = isHovered ? 1.1 : 1.0;
        const clickScale = clickTime > 0 ? 0.9 : 1.0;

        if (anim === 'breathe') { widthMod = p.sin(time) * 10; heightMod = p.cos(time) * 5; }
        else if (anim === 'glitch' && isHovered) { xOffset = p.random(-4, 4); yOffset = p.random(-4, 4); if (p.random(1) > 0.8) widthMod = p.random(-20, 20); }
        else if (anim === 'elastic') { widthMod = isHovered ? p.sin(time * 3) * 15 : 0; }

        if (clickTime > 0) clickTime -= 0.1;

        const finalWidth = (baseWidth + widthMod) * targetScale * clickScale;
        const finalHeight = (baseHeight + heightMod) * targetScale * clickScale;

        if (shape === 'blob') {
          for (let i = 0; i < NUM_NODES; i++) {
            let node = blobNodes[i];
            let nx = p.cos(node.angle) + 1; let ny = p.sin(node.angle) + 1;
            let n = p.noise(nx, ny, time * (isHovered ? 2 : 1));
            let rX = (finalWidth / 2) * p.map(n, 0, 1, 0.8, 1.2);
            let rY = (finalHeight / 2) * p.map(n, 0, 1, 0.8, 1.2);
            let absX = centerX + xOffset + rX * p.cos(node.angle) + node.ox;
            let absY = centerY + yOffset + rY * p.sin(node.angle) + node.oy;

            if (p.mouseIsPressed && isHovered) {
              let dx = p.mouseX - absX; let dy = p.mouseY - absY;
              let dist = p.sqrt(dx * dx + dy * dy);
              if (dist < 100) { node.ox += dx * 0.1; node.oy += dy * 0.1; }
            }
            node.ox += (0 - node.ox) * 0.15; node.oy += (0 - node.oy) * 0.15;
          }
        }

        p.push();
        p.translate(centerX + xOffset, centerY + yOffset);

        if (shape === 'blob') drawBlob(6, 6, finalWidth, finalHeight, '#000000', true);
        else {
          p.fill(0); p.noStroke();
          if (shape === 'circle') p.circle(6, 6, finalWidth);
          else if (shape === 'pill') p.rect(6, 6, finalWidth, finalHeight, finalHeight / 2);
          else p.rect(6, 6, finalWidth, finalHeight);
        }

        if (shape === 'blob') drawBlob(0, 0, finalWidth, finalHeight, buttonColor, false);
        else {
          p.fill(buttonColor); p.stroke(0); p.strokeWeight(4);
          if (shape === 'circle') p.circle(0, 0, finalWidth);
          else if (shape === 'pill') p.rect(0, 0, finalWidth, finalHeight, finalHeight / 2);
          else p.rect(0, 0, finalWidth, finalHeight);
        }

        p.fill(textColor); p.noStroke(); p.textSize(16); p.textStyle(p.BOLD); p.textFont('monospace');
        if (anim === 'glitch' && isHovered && p.random(1) > 0.7) p.text(label.substring(0, label.length - 1) + '@', p.random(-2, 2), p.random(-2, 2));
        else p.text(label, 0, 0);
        
        p.pop();
      };

      p.windowResized = () => { p.resizeCanvas(p.windowWidth > 800 ? 600 : 340, 400); };
    };

    p5Instance.current = new p5(sketch, canvasRef.current);

    return () => {
      // FIX 2: StrictMode cleanup. Explicitly destroy instance and nullify reference.
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-[#f4f4f0] text-black font-mono p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 selection:bg-black selection:text-white">
      <div className="bg-white border-4 border-black p-6 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 relative overflow-y-auto">
        <div className="border-b-4 border-black pb-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">C_Gen</h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">p5.js Physics & React Export</p>
        </div>

        <button onClick={randomizeAll} className="w-full bg-[#FFEA00] border-4 border-black p-3 font-black uppercase text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">Generate Random</button>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase block mb-2">Shape Structure</label>
            <div className="flex gap-2">
              {shapes.map((s) => <button key={s} onClick={() => setConfig({ ...config, shape: s })} className={`flex-1 border-2 border-black p-2 text-xs font-bold uppercase ${config.shape === s ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'}`}>{s}</button>)}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase block mb-2">Kinetic Animation</label>
            <div className="flex gap-2">
              {anims.map((a) => <button key={a} onClick={() => setConfig({ ...config, anim: a })} className={`flex-1 border-2 border-black p-2 text-xs font-bold uppercase ${config.anim === a ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'}`}>{a}</button>)}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase block mb-2">Custom Palette System</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presets.map((p) => <button key={p.name} onClick={() => setConfig({ ...config, buttonColor: p.button, textColor: p.text })} className={`w-8 h-8 border-2 border-black transition-transform ${config.buttonColor === p.button ? 'scale-125 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'hover:scale-110'}`} style={{ backgroundColor: p.button }} title={p.name} />)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[8px] font-bold uppercase mb-1">Button Material</label>
                <input type="color" value={config.buttonColor} onChange={(e) => setConfig({ ...config, buttonColor: e.target.value })} className="w-full h-8 border-2 border-black cursor-pointer p-0" />
              </div>
              <div className="flex flex-col">
                <label className="text-[8px] font-bold uppercase mb-1">Text Fill</label>
                <input type="color" value={config.textColor} onChange={(e) => setConfig({ ...config, textColor: e.target.value })} className="w-full h-8 border-2 border-black cursor-pointer p-0" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase block mb-2">Component Label</label>
            <input type="text" value={config.label} onChange={(e) => setConfig({ ...config, label: e.target.value.toUpperCase() })} maxLength={12} className="w-full bg-zinc-100 border-2 border-black p-2 font-bold focus:outline-none focus:bg-black focus:text-white transition-colors uppercase" />
          </div>
        </div>

        <button onClick={generateReactCode} className={`mt-auto w-full border-4 border-black p-4 font-black uppercase tracking-widest text-sm transition-all ${copied ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'}`}>
          {copied ? 'Copied to Clipboard!' : '</> Copy React Code'}
        </button>
      </div>

      <div className="w-full h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)] bg-zinc-200 border-2 border-black flex justify-center items-center inset-shadow relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-[10px] font-black uppercase">Canvas.render()</div>
        
        {/* FIX 3: Target container minimum dimensions and transparency set */}
        <div ref={canvasRef} className="z-10 shadow-2xl min-w-[340px] min-h-[400px] bg-transparent" />
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
    <div className="min-h-screen bg-zinc-100 flex flex-col font-mono selection:bg-black selection:text-white">
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

      <main className="flex-1 overflow-hidden bg-zinc-100 relative">
        {activeTab === 'poster' ? <BrutalistPosterCreator /> : <InteractiveComponentFoundry />}
      </main>
    </div>
  );
}