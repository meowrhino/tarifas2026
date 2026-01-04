(() => {
  const $ = (id) => document.getElementById(id);

  const fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  const els = {
    clientType: $('clientType'),
    baseAmount: $('baseAmount'),
    extraAmount: $('extraAmount'),
    ivaRate: $('ivaRate'),
    irpfRate: $('irpfRate'),

    subtotalOut: $('subtotalOut'),
    ivaOut: $('ivaOut'),
    irpfOut: $('irpfOut'),
    totalOut: $('totalOut'),
    irpfRow: $('irpfRow'),
    summaryPill: $('summaryPill'),
    noteOut: $('noteOut'),

    exampleA: $('exampleA'),
    exampleB: $('exampleB'),
    resetBtn: $('resetBtn'),
  };

  const toNum = (v) => {
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  function compute() {
    const clientType = els.clientType.value; // 'pro' | 'part'
    const base = Math.max(0, toNum(els.baseAmount.value));
    const extra = Math.max(0, toNum(els.extraAmount.value));
    const ivaRate = Math.max(0, toNum(els.ivaRate.value)) / 100;
    const irpfRate = Math.max(0, toNum(els.irpfRate.value)) / 100;

    const subtotal = round2(base + extra);
    const iva = round2(subtotal * ivaRate);

    const withIrpf = clientType === 'pro';
    const irpf = withIrpf ? round2(subtotal * irpfRate) : 0;

    const total = withIrpf
      ? round2(subtotal + iva - irpf)
      : round2(subtotal + iva);

    // UI
    els.subtotalOut.textContent = fmt.format(subtotal);
    els.ivaOut.textContent = fmt.format(iva);
    els.totalOut.textContent = fmt.format(total);

    if (withIrpf) {
      els.irpfRow.style.display = 'flex';
      els.irpfOut.textContent = '− ' + fmt.format(irpf);
      els.summaryPill.textContent = 'A · con IRPF';
      els.noteOut.textContent = 'Cobras menos ahora porque el cliente ingresa la retención a Hacienda.';
    } else {
      els.irpfRow.style.display = 'none';
      els.irpfOut.textContent = fmt.format(0);
      els.summaryPill.textContent = 'B · sin IRPF';
      els.noteOut.textContent = 'El particular normalmente no puede practicar retención, así que cobras el total + IVA.';
    }
  }

  function bind() {
    const inputs = [
      els.clientType,
      els.baseAmount,
      els.extraAmount,
      els.ivaRate,
      els.irpfRate,
    ];

    inputs.forEach((el) => el.addEventListener('input', compute));
    inputs.forEach((el) => el.addEventListener('change', compute));

    els.exampleA.addEventListener('click', () => {
      els.baseAmount.value = '425';
      els.extraAmount.value = '0';
      compute();
    });

    els.exampleB.addEventListener('click', () => {
      els.baseAmount.value = '425';
      els.extraAmount.value = '150';
      compute();
    });

    els.resetBtn.addEventListener('click', () => {
      els.clientType.value = 'pro';
      els.baseAmount.value = '425';
      els.extraAmount.value = '0';
      els.ivaRate.value = '21';
      els.irpfRate.value = '15';
      compute();
    });
  }

  bind();
  compute();
})();
