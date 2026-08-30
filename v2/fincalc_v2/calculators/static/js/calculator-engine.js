/**
 * FinCalc v2 - Reactive Calculator Engine & Pure SVG Visualizer
 * Zero external dependencies. Ultra-fast sub-1ms computation.
 */

(function () {
  'use strict';

  // Currency & Number Formatters
  const formatCurrency = (val, currencySymbol = '$') => {
    if (isNaN(val) || !isFinite(val)) return `${currencySymbol}0.00`;
    return `${currencySymbol}${Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatNumber = (val, decimals = 2) => {
    if (isNaN(val) || !isFinite(val)) return '0';
    return Number(val).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Pure SVG Donut Chart Generator
  const renderDonutChart = (containerId, segments) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
    if (total === 0) {
      container.innerHTML = '<p class="text-muted text-center" style="font-size:0.85rem;">Enter values to see breakdown</p>';
      return;
    }

    const size = 200;
    const strokeWidth = 28;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedAngle = 0;
    let paths = '';
    let legendHtml = '<div class="chart-legend">';

    segments.forEach((segment) => {
      const fraction = Math.max(0, segment.value) / total;
      const strokeDasharray = `${fraction * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle * circumference;
      accumulatedAngle += fraction;

      const pct = (fraction * 100).toFixed(1);

      paths += `
        <circle
          cx="${center}"
          cy="${center}"
          r="${radius}"
          fill="transparent"
          stroke="${segment.color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDasharray}"
          stroke-dashoffset="${strokeDashoffset}"
          transform="rotate(-90 ${center} ${center})"
          style="transition: stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease;"
        />
      `;

      legendHtml += `
        <div class="legend-item">
          <span class="legend-indicator" style="background-color: ${segment.color};"></span>
          <span>${segment.label} (${pct}%)</span>
        </div>
      `;
    });

    legendHtml += '</div>';

    container.innerHTML = `
      <div class="chart-svg-wrap">
        <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%">
          ${paths}
        </svg>
      </div>
      ${legendHtml}
    `;
  };

  const updateLiveLabel = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // Calculator Logic Modules
  const CalculatorEngines = {
    // 1. Loan EMI Calculator
    loan: function () {
      const amount = parseFloat(document.getElementById('input-amount')?.value) || 0;
      const rate = parseFloat(document.getElementById('input-rate')?.value) || 0;
      const term = parseFloat(document.getElementById('input-term')?.value) || 0;

      updateLiveLabel('live-amount', '$' + Number(amount).toLocaleString());
      updateLiveLabel('live-rate', rate + '%');
      updateLiveLabel('live-term', term + ' Years');

      const monthlyRate = rate / 100 / 12;
      const totalMonths = term * 12;

      let monthlyPayment = 0;
      let totalPayment = 0;
      let totalInterest = 0;

      if (amount > 0 && totalMonths > 0) {
        if (monthlyRate === 0) {
          monthlyPayment = amount / totalMonths;
          totalPayment = amount;
          totalInterest = 0;
        } else {
          const factor = Math.pow(1 + monthlyRate, totalMonths);
          monthlyPayment = (amount * monthlyRate * factor) / (factor - 1);
          totalPayment = monthlyPayment * totalMonths;
          totalInterest = totalPayment - amount;
        }
      }

      document.getElementById('res-primary').textContent = formatCurrency(monthlyPayment);
      document.getElementById('res-stat-1').textContent = formatCurrency(amount);
      document.getElementById('res-stat-2').textContent = formatCurrency(totalInterest);
      document.getElementById('res-stat-3').textContent = formatCurrency(totalPayment);

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(totalInterest);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(totalPayment);

      const pctPrincipal = totalPayment > 0 ? ((amount / totalPayment) * 100).toFixed(1) + '%' : '0%';
      const pctInterest = totalPayment > 0 ? ((totalInterest / totalPayment) * 100).toFixed(1) + '%' : '0%';

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = pctPrincipal;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = pctInterest;

      renderDonutChart('chart-container', [
        { label: 'Principal', value: amount, color: '#4f46e5' },
        { label: 'Total Interest', value: totalInterest, color: '#f43f5e' }
      ]);

      // Populate Amortization Table
      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && amount > 0) {
        let balance = amount;
        let html = '';
        for (let yr = 1; yr <= term; yr++) {
          let yrInterest = 0;
          let yrPrincipal = 0;
          for (let m = 1; m <= 12; m++) {
            const mInterest = balance * monthlyRate;
            const mPrincipal = monthlyPayment - mInterest;
            yrInterest += mInterest;
            yrPrincipal += mPrincipal;
            balance -= mPrincipal;
          }
          html += `
            <tr>
              <td>Year ${yr}</td>
              <td>${formatCurrency(yrPrincipal)}</td>
              <td>${formatCurrency(yrInterest)}</td>
              <td>${formatCurrency(Math.max(0, balance))}</td>
            </tr>
          `;
        }
        tableBody.innerHTML = html;
      }
    },

    // 2. Mortgage Calculator
    mortgage: function () {
      const homePrice = parseFloat(document.getElementById('input-home-price')?.value) || 0;
      const downPaymentPct = parseFloat(document.getElementById('input-down-pct')?.value) || 0;
      const rate = parseFloat(document.getElementById('input-rate')?.value) || 0;
      const term = parseFloat(document.getElementById('input-term')?.value) || 30;
      const propTaxYear = parseFloat(document.getElementById('input-tax')?.value) || 0;
      const insuranceYear = parseFloat(document.getElementById('input-insurance')?.value) || 0;
      const hoaMonth = parseFloat(document.getElementById('input-hoa')?.value) || 0;

      updateLiveLabel('live-price', '$' + Number(homePrice).toLocaleString());
      updateLiveLabel('live-down', downPaymentPct + '%');
      updateLiveLabel('live-rate', rate + '%');

      const downPayment = (homePrice * downPaymentPct) / 100;
      const loanAmount = Math.max(0, homePrice - downPayment);
      const monthlyRate = rate / 100 / 12;
      const totalMonths = term * 12;

      let piMonthly = 0;
      if (loanAmount > 0 && totalMonths > 0) {
        if (monthlyRate === 0) {
          piMonthly = loanAmount / totalMonths;
        } else {
          const x = Math.pow(1 + monthlyRate, totalMonths);
          piMonthly = (loanAmount * monthlyRate * x) / (x - 1);
        }
      }

      const taxMonthly = propTaxYear / 12;
      const insMonthly = insuranceYear / 12;
      const totalMonthly = piMonthly + taxMonthly + insMonthly + hoaMonth;
      const totalInterest = (piMonthly * totalMonths) - loanAmount;

      document.getElementById('res-primary').textContent = formatCurrency(totalMonthly);
      document.getElementById('res-stat-1').textContent = formatCurrency(piMonthly);
      document.getElementById('res-stat-2').textContent = formatCurrency(totalInterest);
      document.getElementById('res-stat-3').textContent = formatCurrency(totalMonthly * totalMonths);

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(totalInterest);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(totalMonthly * totalMonths);

      renderDonutChart('chart-container', [
        { label: 'Principal & Interest', value: piMonthly, color: '#4f46e5' },
        { label: 'Property Tax', value: taxMonthly, color: '#10b981' },
        { label: 'Home Insurance', value: insMonthly, color: '#f59e0b' },
        { label: 'HOA Fees', value: hoaMonth, color: '#8b5cf6' }
      ]);
    },

    // 3. SIP (Systematic Investment Plan) with Optional Step-Up
    sip: function () {
      const monthlyInvest = parseFloat(document.getElementById('input-monthly')?.value) || 0;
      const returnRate = parseFloat(document.getElementById('input-rate')?.value) || 0;
      const years = parseFloat(document.getElementById('input-years')?.value) || 1;
      const stepUpPct = parseFloat(document.getElementById('input-step-up')?.value) || 0;

      updateLiveLabel('live-monthly', '$' + Number(monthlyInvest).toLocaleString());
      updateLiveLabel('live-rate', returnRate + '%');
      updateLiveLabel('live-years', years + ' Years');
      updateLiveLabel('live-step-up', stepUpPct + '%');

      const monthlyRate = returnRate / 100 / 12;
      let totalValue = 0;
      let totalInvested = 0;
      let currentMonthly = monthlyInvest;
      const scheduleRows = [];

      for (let y = 1; y <= years; y++) {
        let yrInvested = 0;
        let yrGains = 0;

        for (let m = 1; m <= 12; m++) {
          totalInvested += currentMonthly;
          yrInvested += currentMonthly;

          const gain = (totalValue + currentMonthly) * monthlyRate;
          totalValue = totalValue + currentMonthly + gain;
          yrGains += gain;
        }

        scheduleRows.push({
          period: `Year ${y}`,
          invested: totalInvested,
          gains: yrGains,
          balance: totalValue
        });

        if (stepUpPct > 0) {
          currentMonthly = currentMonthly * (1 + (stepUpPct / 100));
        }
      }

      const totalReturns = Math.max(0, totalValue - totalInvested);

      document.getElementById('res-primary').textContent = formatCurrency(totalValue);
      document.getElementById('res-stat-1').textContent = formatCurrency(monthlyInvest);
      document.getElementById('res-stat-2').textContent = formatCurrency(totalInvested);
      document.getElementById('res-stat-3').textContent = formatCurrency(totalReturns);

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(totalReturns);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(totalValue);

      const invPct = totalValue > 0 ? ((totalInvested / totalValue) * 100).toFixed(1) + '%' : '100%';
      const retPct = totalValue > 0 ? ((totalReturns / totalValue) * 100).toFixed(1) + '%' : '0%';

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${invPct} Capital`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${retPct} Growth`;

      renderDonutChart('chart-container', [
        { label: 'Total Invested Capital', value: totalInvested, color: '#94a3b8' },
        { label: 'Estimated Wealth Gains', value: totalReturns, color: '#059669' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        let html = '';
        scheduleRows.forEach(row => {
          html += `
            <tr>
              <td><strong>${row.period}</strong></td>
              <td>${formatCurrency(row.invested)}</td>
              <td>${formatCurrency(row.gains)}</td>
              <td><strong>${formatCurrency(row.balance)}</strong></td>
            </tr>
          `;
        });
        tableBody.innerHTML = html;
      }
    },

    // 4. Fixed Deposit (FD)
    fd: function () {
      const principal = parseFloat(document.getElementById('input-deposit')?.value) || 0;
      const rate = parseFloat(document.getElementById('input-rate')?.value) || 0;
      const years = parseFloat(document.getElementById('input-years')?.value) || 0;
      const freq = parseInt(document.getElementById('select-freq')?.value || '4'); // 4 = quarterly

      const r = rate / 100;
      const maturity = principal * Math.pow(1 + r / freq, freq * years);
      const interestEarned = Math.max(0, maturity - principal);

      document.getElementById('res-primary').textContent = formatCurrency(maturity);
      document.getElementById('res-stat-1').textContent = formatCurrency(principal);
      document.getElementById('res-stat-2').textContent = formatCurrency(interestEarned);
      document.getElementById('res-stat-3').textContent = `${((interestEarned / (principal || 1)) * 100).toFixed(1)}%`;

      renderDonutChart('chart-container', [
        { label: 'Deposit Principal', value: principal, color: '#3b82f6' },
        { label: 'Total Interest', value: interestEarned, color: '#10b981' }
      ]);
    },

    // 5. Investment & Wealth Strategy (Inflation-Adjusted Real vs Nominal Growth)
    investment: function () {
      const initial = parseFloat(document.getElementById('input-initial')?.value) || 0;
      const contribution = parseFloat(document.getElementById('input-monthly-inv')?.value) || 0;
      const years = parseFloat(document.getElementById('input-inv-years')?.value) || 1;
      const returnRate = parseFloat(document.getElementById('input-return-rate')?.value) || 0;
      const inflationRate = parseFloat(document.getElementById('input-inflation')?.value) || 0;

      updateLiveLabel('live-initial', '$' + Number(initial).toLocaleString());
      updateLiveLabel('live-monthly-inv', '$' + Number(contribution).toLocaleString());
      updateLiveLabel('live-inv-years', years + ' Years');
      updateLiveLabel('live-return-rate', returnRate + '%');
      updateLiveLabel('live-inflation', inflationRate + '%');

      const r = returnRate / 100;
      const i = inflationRate / 100;

      let nominalBalance = initial;
      let realBalance = initial;
      let totalContributed = initial;

      const scheduleRows = [];

      for (let t = 1; t <= years; t++) {
        let yrGainsNominal = 0;
        let yrContrib = 0;

        for (let m = 1; m <= 12; m++) {
          const nominalGain = nominalBalance * (r / 12);
          nominalBalance = nominalBalance + nominalGain + contribution;
          realBalance = realBalance * (1 + (r - i) / 12) + contribution;
          totalContributed += contribution;

          yrGainsNominal += nominalGain;
          yrContrib += contribution;
        }

        scheduleRows.push({
          period: `Year ${t}`,
          contributed: totalContributed,
          gain: yrGainsNominal,
          balance: nominalBalance,
          realBalance: realBalance
        });
      }

      const totalGain = Math.max(0, nominalBalance - totalContributed);

      document.getElementById('res-primary').textContent = formatCurrency(nominalBalance);
      const elRealVal = document.getElementById('res-real-val');
      if (elRealVal) elRealVal.textContent = formatCurrency(realBalance);

      document.getElementById('res-stat-1').textContent = formatCurrency(initial);
      document.getElementById('res-stat-2').textContent = formatCurrency(totalContributed);
      document.getElementById('res-stat-3').textContent = formatCurrency(totalGain);

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(totalGain);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(nominalBalance);

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = formatCurrency(nominalBalance);

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = formatCurrency(realBalance);

      renderDonutChart('chart-container', [
        { label: 'Total Contributed', value: totalContributed, color: '#94a3b8' },
        { label: 'Total Capital Gains', value: totalGain, color: '#0891b2' }
      ]);

      // Growth Schedule Table
      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        let html = '';
        scheduleRows.forEach(row => {
          html += `
            <tr>
              <td><strong>${row.period}</strong></td>
              <td>${formatCurrency(row.contributed)}</td>
              <td>${formatCurrency(row.gain)}</td>
              <td><strong>${formatCurrency(row.balance)}</strong> <span style="font-size:0.75rem; color:#0891b2;">(Real: ${formatCurrency(row.realBalance)})</span></td>
            </tr>
          `;
        });
        tableBody.innerHTML = html;
      }
    },

    // 6. Interest Calculator (Deposit Compounding & APY)
    interest: function () {
      const principal = parseFloat(document.getElementById('input-principal')?.value) || 0;
      const monthlyContribution = parseFloat(document.getElementById('input-contrib')?.value) || 0;
      const rate = parseFloat(document.getElementById('input-rate')?.value) || 0;
      const years = parseFloat(document.getElementById('input-years')?.value) || 1;
      const freq = parseInt(document.getElementById('select-freq')?.value || '12');

      updateLiveLabel('live-principal', '$' + Number(principal).toLocaleString());
      updateLiveLabel('live-contrib', '$' + Number(monthlyContribution).toLocaleString());
      updateLiveLabel('live-rate', rate + '%');
      updateLiveLabel('live-years', years + ' Years');

      const r = rate / 100;
      let balance = principal;
      let totalContributed = principal;

      const scheduleRows = [];

      for (let t = 1; t <= years; t++) {
        let yrInterest = 0;
        let yrContrib = 0;

        for (let m = 1; m <= 12; m++) {
          const mInterest = balance * (r / freq) * (freq / 12);
          balance = balance + mInterest + monthlyContribution;
          totalContributed += monthlyContribution;

          yrInterest += mInterest;
          yrContrib += monthlyContribution;
        }

        scheduleRows.push({
          period: `Year ${t}`,
          contributed: totalContributed,
          interest: yrInterest,
          balance: balance
        });
      }

      const totalInterest = Math.max(0, balance - totalContributed);

      document.getElementById('res-primary').textContent = formatCurrency(balance);
      document.getElementById('res-stat-1').textContent = formatCurrency(principal);
      document.getElementById('res-stat-2').textContent = formatCurrency(totalInterest);
      document.getElementById('res-stat-3').textContent = formatCurrency(totalContributed);

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(totalInterest);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(balance);

      const pctPrincipal = balance > 0 ? ((totalContributed / balance) * 100).toFixed(1) + '%' : '0%';
      const pctInterest = balance > 0 ? ((totalInterest / balance) * 100).toFixed(1) + '%' : '0%';

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = pctPrincipal;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = pctInterest;

      renderDonutChart('chart-container', [
        { label: 'Total Deposits', value: totalContributed, color: '#f59e0b' },
        { label: 'Total Interest Earned', value: totalInterest, color: '#10b981' }
      ]);

      // Growth Schedule Table
      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        let html = '';
        scheduleRows.forEach(row => {
          html += `
            <tr>
              <td><strong>${row.period}</strong></td>
              <td>${formatCurrency(row.contributed)}</td>
              <td>${formatCurrency(row.interest)}</td>
              <td><strong>${formatCurrency(row.balance)}</strong></td>
            </tr>
          `;
        });
        tableBody.innerHTML = html;
      }
    },

    // 7. CAGR (Compound Annual Growth Rate)
    cagr: function () {
      const startVal = parseFloat(document.getElementById('input-start-val')?.value) || 0;
      const endVal = parseFloat(document.getElementById('input-end-val')?.value) || 0;
      const years = parseFloat(document.getElementById('input-years')?.value) || 1;
      const benchmark = document.getElementById('select-benchmark')?.value || 'sp500';

      updateLiveLabel('live-start-val', '$' + Number(startVal).toLocaleString());
      updateLiveLabel('live-end-val', '$' + Number(endVal).toLocaleString());
      updateLiveLabel('live-years', years + ' Years');

      let cagrPct = 0;
      if (startVal > 0 && endVal > 0 && years > 0) {
        cagrPct = (Math.pow(endVal / startVal, 1 / years) - 1) * 100;
      }

      const absoluteGain = endVal - startVal;
      const totalPctGain = startVal > 0 ? (absoluteGain / startVal) * 100 : 0;

      document.getElementById('res-primary').textContent = `${cagrPct.toFixed(2)}% CAGR`;
      document.getElementById('res-stat-1').textContent = formatCurrency(startVal);
      document.getElementById('res-stat-2').textContent = formatCurrency(absoluteGain);
      document.getElementById('res-stat-3').textContent = `${totalPctGain >= 0 ? '+' : ''}${totalPctGain.toFixed(1)}%`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(absoluteGain);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(endVal);

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${((startVal / (endVal || 1)) * 100).toFixed(1)}% Initial Capital`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${((absoluteGain / (endVal || 1)) * 100).toFixed(1)}% Capital Profit`;

      renderDonutChart('chart-container', [
        { label: 'Initial Beginning Capital', value: startVal, color: '#94a3b8' },
        { label: 'Total Capital Profit', value: Math.max(0, absoluteGain), color: '#7c3aed' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && startVal > 0) {
        let html = '';
        let curr = startVal;
        const growthFactor = 1 + (cagrPct / 100);
        for (let y = 1; y <= years; y++) {
          const prev = curr;
          curr = curr * growthFactor;
          html += `
            <tr>
              <td><strong>Year ${y}</strong></td>
              <td>${formatCurrency(startVal)}</td>
              <td>+${formatCurrency(curr - prev)}</td>
              <td><strong>${formatCurrency(curr)}</strong></td>
            </tr>
          `;
        }
        tableBody.innerHTML = html;
      }
    },

    // 8. Salary & Wage Calculator
    salary: function () {
      const amount = parseFloat(document.getElementById('input-wage')?.value) || 0;
      const mode = document.getElementById('select-wage-mode')?.value || 'hourly';
      const hoursWeek = parseFloat(document.getElementById('input-hours')?.value) || 40;
      const weeksYear = 52;

      let annual = 0;
      if (mode === 'hourly') annual = amount * hoursWeek * weeksYear;
      else if (mode === 'daily') annual = amount * 5 * weeksYear;
      else if (mode === 'weekly') annual = amount * weeksYear;
      else if (mode === 'monthly') annual = amount * 12;
      else if (mode === 'annual') annual = amount;

      const monthly = annual / 12;
      const biweekly = annual / 26;
      const weekly = annual / 52;
      const daily = annual / (5 * 52);
      const hourly = annual / (hoursWeek * weeksYear);

      const estTaxes = annual * 0.25;
      const estTakeHome = annual * 0.75;

      document.getElementById('res-primary').textContent = formatCurrency(annual);
      document.getElementById('res-stat-1').textContent = formatCurrency(monthly);
      document.getElementById('res-stat-2').textContent = formatCurrency(biweekly);
      document.getElementById('res-stat-3').textContent = `${formatCurrency(hourly)}/hr`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(estTaxes);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(annual);

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = formatCurrency(estTakeHome);

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = formatCurrency(estTaxes);

      renderDonutChart('chart-container', [
        { label: 'Estimated Take-Home (75%)', value: estTakeHome, color: '#10b981' },
        { label: 'Taxes & Deductions (25%)', value: estTaxes, color: '#f43f5e' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        tableBody.innerHTML = `
          <tr><td><strong>Hourly</strong></td><td>${formatCurrency(hourly)}</td><td>${formatCurrency(hourly * 0.75)}</td><td>Based on ${hoursWeek} hrs/week</td></tr>
          <tr><td><strong>Daily</strong></td><td>${formatCurrency(daily)}</td><td>${formatCurrency(daily * 0.75)}</td><td>8 hours / day standard</td></tr>
          <tr><td><strong>Weekly</strong></td><td>${formatCurrency(weekly)}</td><td>${formatCurrency(weekly * 0.75)}</td><td>52 pay cycles / year</td></tr>
          <tr><td><strong>Bi-Weekly</strong></td><td>${formatCurrency(biweekly)}</td><td>${formatCurrency(biweekly * 0.75)}</td><td>26 pay cycles / year</td></tr>
          <tr><td><strong>Monthly</strong></td><td>${formatCurrency(monthly)}</td><td>${formatCurrency(monthly * 0.75)}</td><td>12 calendar months</td></tr>
          <tr><td><strong>Annual Gross</strong></td><td>${formatCurrency(annual)}</td><td>${formatCurrency(estTakeHome)}</td><td>Total yearly compensation</td></tr>
        `;
      }
    },

    // 9. Inflation Calculator
    inflation: function () {
      const amount = parseFloat(document.getElementById('input-amount')?.value) || 0;
      const rate = parseFloat(document.getElementById('input-rate')?.value) || 0;
      const years = parseFloat(document.getElementById('input-years')?.value) || 0;

      updateLiveLabel('live-amount', '$' + Number(amount).toLocaleString());
      updateLiveLabel('live-rate', rate + '%');
      updateLiveLabel('live-years', years + ' Years');

      const futureRequired = amount * Math.pow(1 + (rate / 100), years);
      const futurePurchasingPower = amount / Math.pow(1 + (rate / 100), years);
      const purchasingLoss = ((amount - futurePurchasingPower) / (amount || 1)) * 100;
      const valueLost = amount - futurePurchasingPower;

      document.getElementById('res-primary').textContent = formatCurrency(futureRequired);
      document.getElementById('res-stat-1').textContent = formatCurrency(amount);
      document.getElementById('res-stat-2').textContent = formatCurrency(valueLost);
      document.getElementById('res-stat-3').textContent = `${purchasingLoss.toFixed(1)}% Loss`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(valueLost);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(futureRequired);

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${(100 - purchasingLoss).toFixed(1)}% Retained`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${purchasingLoss.toFixed(1)}% Lost`;

      renderDonutChart('chart-container', [
        { label: 'Retained Purchasing Power', value: Math.max(0, futurePurchasingPower), color: '#3b82f6' },
        { label: 'Lost to Inflation', value: Math.max(0, valueLost), color: '#f43f5e' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && amount > 0) {
        let html = '';
        for (let y = 1; y <= Math.min(years, 30); y++) {
          const req = amount * Math.pow(1 + (rate / 100), y);
          const pwr = amount / Math.pow(1 + (rate / 100), y);
          html += `
            <tr>
              <td><strong>Year ${y}</strong></td>
              <td>${formatCurrency(req)}</td>
              <td>-${formatCurrency(amount - pwr)}</td>
              <td><strong>${formatCurrency(pwr)} Power</strong></td>
            </tr>
          `;
        }
        tableBody.innerHTML = html;
      }
    },

    // 10. Credit Card Payoff
    credit_card: function () {
      const balance = parseFloat(document.getElementById('input-balance')?.value) || 0;
      const apr = parseFloat(document.getElementById('input-apr')?.value) || 0;
      const payment = parseFloat(document.getElementById('input-payment')?.value) || 0;

      const monthlyRate = apr / 100 / 12;
      let months = 0;
      let totalInterest = 0;
      let currBalance = balance;

      if (payment > (currBalance * monthlyRate)) {
        while (currBalance > 0 && months < 360) {
          const interest = currBalance * monthlyRate;
          totalInterest += interest;
          currBalance = currBalance + interest - payment;
          months++;
        }
      } else {
        months = 999;
      }

      const totalPaid = balance + totalInterest;

      document.getElementById('res-primary').textContent = months > 360 ? 'Payment Too Low' : `${months} Months`;
      document.getElementById('res-stat-1').textContent = formatCurrency(balance);
      document.getElementById('res-stat-2').textContent = formatCurrency(totalInterest);
      document.getElementById('res-stat-3').textContent = formatCurrency(totalPaid);

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(totalInterest);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(totalPaid);

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${((balance / (totalPaid || 1)) * 100).toFixed(1)}% Balance`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${((totalInterest / (totalPaid || 1)) * 100).toFixed(1)}% Interest`;

      renderDonutChart('chart-container', [
        { label: 'Card Balance', value: balance, color: '#3b82f6' },
        { label: 'Interest Paid', value: totalInterest, color: '#ef4444' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && balance > 0 && months <= 360) {
        let b = balance;
        let html = '';
        for (let m = 1; m <= months; m++) {
          const interest = b * monthlyRate;
          const princ = Math.min(b, payment - interest);
          b = Math.max(0, b - princ);
          if (m <= 12 || m % 12 === 0 || b === 0) {
            html += `
              <tr>
                <td><strong>Month ${m}</strong></td>
                <td>${formatCurrency(princ)}</td>
                <td>${formatCurrency(interest)}</td>
                <td><strong>${formatCurrency(b)}</strong></td>
              </tr>
            `;
          }
          if (b === 0) break;
        }
        tableBody.innerHTML = html;
      }
    },

    // 11. BMI Calculator
    bmi: function () {
      const heightCm = parseFloat(document.getElementById('input-height')?.value) || 175;
      const weightKg = parseFloat(document.getElementById('input-weight')?.value) || 72;

      updateLiveLabel('live-height', heightCm + ' cm');
      updateLiveLabel('live-weight', weightKg + ' kg');

      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);

      let category = 'Normal weight';
      let color = '#10b981';

      if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3b82f6';
      } else if (bmi < 25) {
        category = 'Normal weight';
        color = '#10b981';
      } else if (bmi < 30) {
        category = 'Overweight';
        color = '#f59e0b';
      } else {
        category = 'Obesity';
        color = '#ef4444';
      }

      const minHealthyKg = 18.5 * (heightM * heightM);
      const maxHealthyKg = 24.9 * (heightM * heightM);

      document.getElementById('res-primary').textContent = bmi.toFixed(1);
      document.getElementById('res-stat-1').textContent = category;
      document.getElementById('res-stat-2').textContent = `${minHealthyKg.toFixed(1)} - ${maxHealthyKg.toFixed(1)} kg`;
      document.getElementById('res-stat-3').textContent = `${(bmi / 22).toFixed(2)} (BMI Prime)`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = category;

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = `${minHealthyKg.toFixed(1)} - ${maxHealthyKg.toFixed(1)} kg`;

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${bmi.toFixed(1)} BMI`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `18.5 - 24.9 Target`;

      renderDonutChart('chart-container', [
        { label: category, value: bmi, color: color },
        { label: 'Ideal Benchmark (22.0)', value: 22, color: '#e2e8f0' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        tableBody.innerHTML = `
          <tr><td><strong>Severe Thinness</strong></td><td>&lt; 16.0</td><td>Underweight</td><td>Elevated Health Risk</td></tr>
          <tr><td><strong>Mild Thinness</strong></td><td>17.0 – 18.4</td><td>Underweight</td><td>Slight Risk</td></tr>
          <tr><td><strong>Normal Weight</strong></td><td>18.5 – 24.9</td><td>Healthy Range</td><td>Optimal Metabolic Benchmark</td></tr>
          <tr><td><strong>Overweight</strong></td><td>25.0 – 29.9</td><td>Overweight</td><td>Increased Risk</td></tr>
          <tr><td><strong>Obese (Class I)</strong></td><td>30.0 – 34.9</td><td>Obese</td><td>High Cardiovascular Risk</td></tr>
          <tr><td><strong>Severe Obesity</strong></td><td>&ge; 35.0</td><td>Morbid Obesity</td><td>Extremely High Risk</td></tr>
        `;
      }
    },

    // 12. Calorie & TDEE Calculator (Mifflin-St Jeor)
    calorie: function () {
      const age = parseFloat(document.getElementById('input-age')?.value) || 30;
      const gender = document.getElementById('select-gender')?.value || 'male';
      const weightKg = parseFloat(document.getElementById('input-weight')?.value) || 75;
      const heightCm = parseFloat(document.getElementById('input-height')?.value) || 175;
      const activity = parseFloat(document.getElementById('select-activity')?.value || '1.55');

      updateLiveLabel('live-height', heightCm + ' cm');
      updateLiveLabel('live-weight', weightKg + ' kg');

      let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
      bmr += (gender === 'male') ? 5 : -161;

      const tdee = Math.round(bmr * activity);
      const weightLossCal = Math.max(1000, Math.round(tdee - 500));
      const weightGainCal = Math.round(tdee + 500);
      const activeCalories = Math.max(0, tdee - Math.round(bmr));

      document.getElementById('res-primary').textContent = `${tdee.toLocaleString()} kcal/day`;
      document.getElementById('res-stat-1').textContent = `${Math.round(bmr).toLocaleString()} kcal`;
      document.getElementById('res-stat-2').textContent = `${weightLossCal.toLocaleString()} kcal`;
      document.getElementById('res-stat-3').textContent = `${weightGainCal.toLocaleString()} kcal`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = `${activeCalories.toLocaleString()} kcal`;

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = `${tdee.toLocaleString()} kcal/day`;

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${Math.round(bmr).toLocaleString()} kcal (BMR)`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${activeCalories.toLocaleString()} kcal (Activity)`;

      renderDonutChart('chart-container', [
        { label: 'Basal Metabolic Rate (BMR)', value: Math.round(bmr), color: '#4f46e5' },
        { label: 'Daily Activity Expenditure', value: activeCalories, color: '#f59e0b' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        tableBody.innerHTML = `
          <tr><td><strong>Maintenance (TDEE)</strong></td><td>${tdee.toLocaleString()} kcal/day</td><td>0 kcal</td><td>Maintains current weight (${weightKg} kg)</td></tr>
          <tr><td><strong>Mild Weight Loss</strong></td><td>${Math.max(1000, tdee - 250).toLocaleString()} kcal/day</td><td>-250 kcal</td><td>-0.25 kg / week pace</td></tr>
          <tr><td><strong>Standard Weight Loss</strong></td><td>${weightLossCal.toLocaleString()} kcal/day</td><td>-500 kcal</td><td>-0.50 kg / week pace</td></tr>
          <tr><td><strong>Extreme Weight Loss</strong></td><td>${Math.max(1000, tdee - 1000).toLocaleString()} kcal/day</td><td>-1,000 kcal</td><td>-1.00 kg / week pace</td></tr>
          <tr><td><strong>Clean Muscle Gain</strong></td><td>${Math.round(tdee + 250).toLocaleString()} kcal/day</td><td>+250 kcal</td><td>+0.25 kg / week lean surplus</td></tr>
          <tr><td><strong>Fast Weight Gain</strong></td><td>${weightGainCal.toLocaleString()} kcal/day</td><td>+500 kcal</td><td>+0.50 kg / week surplus</td></tr>
        `;
      }
    },

    // 13. GST & Sales Tax Calculator
    gst: function () {
      const amount = parseFloat(document.getElementById('input-amount')?.value) || 0;
      const rate = parseFloat(document.getElementById('input-rate')?.value) || 18;
      const type = document.getElementById('select-type')?.value || 'exclusive';

      updateLiveLabel('live-amount', '$' + Number(amount).toLocaleString());

      let netAmount = 0;
      let gstAmount = 0;
      let totalAmount = 0;

      if (type === 'exclusive') {
        netAmount = amount;
        gstAmount = (amount * rate) / 100;
        totalAmount = netAmount + gstAmount;
      } else {
        totalAmount = amount;
        gstAmount = amount - (amount * (100 / (100 + rate)));
        netAmount = totalAmount - gstAmount;
      }

      document.getElementById('res-primary').textContent = formatCurrency(totalAmount);
      document.getElementById('res-stat-1').textContent = formatCurrency(netAmount);
      document.getElementById('res-stat-2').textContent = formatCurrency(gstAmount);
      document.getElementById('res-stat-3').textContent = `${rate}% GST`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(gstAmount);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(totalAmount);

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${((netAmount / (totalAmount || 1)) * 100).toFixed(1)}% Base`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${((gstAmount / (totalAmount || 1)) * 100).toFixed(1)}% Tax`;

      renderDonutChart('chart-container', [
        { label: 'Net Pre-Tax Base', value: netAmount, color: '#3b82f6' },
        { label: 'GST / Tax Payable', value: gstAmount, color: '#ef4444' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && amount > 0) {
        const slabs = [5, 12, 18, 28];
        let html = '';
        slabs.forEach(s => {
          let base, tax, tot;
          if (type === 'exclusive') {
            base = amount;
            tax = (amount * s) / 100;
            tot = base + tax;
          } else {
            tot = amount;
            tax = amount - (amount * (100 / (100 + s)));
            base = tot - tax;
          }
          html += `
            <tr>
              <td><strong>${s}% Slab</strong></td>
              <td>${formatCurrency(base)}</td>
              <td>${formatCurrency(tax)}</td>
              <td><strong>${formatCurrency(tot)}</strong></td>
            </tr>
          `;
        });
        tableBody.innerHTML = html;
      }
    },

    // 14. Margin & Markup Engine (Multi-Strategy: Cost/Price, Target Margin, Target Markup)
    margin: function () {
      const modeSelect = document.getElementById('select-margin-mode');
      const mode = modeSelect?.value || 'cost_revenue';

      const revWrap = document.getElementById('field-revenue-wrap');
      const targetMarginWrap = document.getElementById('field-target-margin-wrap');
      const targetMarkupWrap = document.getElementById('field-target-markup-wrap');

      if (revWrap && targetMarginWrap && targetMarkupWrap) {
        revWrap.style.display = mode === 'cost_revenue' ? 'block' : 'none';
        targetMarginWrap.style.display = mode === 'cost_margin' ? 'block' : 'none';
        targetMarkupWrap.style.display = mode === 'cost_markup' ? 'block' : 'none';
      }

      const cost = parseFloat(document.getElementById('input-cost')?.value) || 0;
      updateLiveLabel('live-cost', '$' + Number(cost).toFixed(2));

      let revenue = 0;
      let profit = 0;
      let marginPct = 0;
      let markupPct = 0;

      if (mode === 'cost_revenue') {
        revenue = parseFloat(document.getElementById('input-revenue')?.value) || 0;
        updateLiveLabel('live-revenue', '$' + Number(revenue).toFixed(2));
        profit = revenue - cost;
        marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;
        markupPct = cost > 0 ? (profit / cost) * 100 : 0;
      } else if (mode === 'cost_margin') {
        const targetMargin = parseFloat(document.getElementById('input-target-margin')?.value) || 0;
        updateLiveLabel('live-target-margin', targetMargin.toFixed(1) + '%');
        marginPct = targetMargin;
        revenue = targetMargin < 100 ? cost / (1 - (targetMargin / 100)) : cost;
        profit = revenue - cost;
        markupPct = cost > 0 ? (profit / cost) * 100 : 0;
      } else if (mode === 'cost_markup') {
        const targetMarkup = parseFloat(document.getElementById('input-target-markup')?.value) || 0;
        updateLiveLabel('live-target-markup', targetMarkup.toFixed(1) + '%');
        markupPct = targetMarkup;
        revenue = cost * (1 + (targetMarkup / 100));
        profit = revenue - cost;
        marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;
      }

      document.getElementById('res-primary').textContent = `${marginPct.toFixed(2)}%`;
      document.getElementById('res-stat-1').textContent = formatCurrency(cost);
      document.getElementById('res-stat-2').textContent = formatCurrency(profit);
      document.getElementById('res-stat-3').textContent = `${markupPct.toFixed(2)}%`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(profit);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(revenue);

      const costPct = revenue > 0 ? ((cost / revenue) * 100).toFixed(1) + '%' : '100%';
      const profitPct = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) + '%' : '0%';

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${costPct} Cost`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${profitPct} Margin`;

      renderDonutChart('chart-container', [
        { label: 'Cost of Goods Sold', value: cost, color: '#94a3b8' },
        { label: 'Gross Profit', value: Math.max(0, profit), color: '#10b981' }
      ]);

      // Pricing Sensitivity Matrix Table
      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && cost > 0) {
        const benchmarkMargins = [15, 25, 35, 45, 50, 60, 75];
        let html = '';
        benchmarkMargins.forEach(m => {
          const reqRev = cost / (1 - (m / 100));
          const unitProf = reqRev - cost;
          const reqMarkup = (unitProf / cost) * 100;
          html += `
            <tr>
              <td><strong>${m}% Margin</strong></td>
              <td>${formatCurrency(reqRev)}</td>
              <td>${reqMarkup.toFixed(1)}% Markup</td>
              <td><strong>${formatCurrency(unitProf)} / unit</strong></td>
            </tr>
          `;
        });
        tableBody.innerHTML = html;
      }
    },

    // 15. Break-Even Analysis
    break_even: function () {
      const fixedCost = parseFloat(document.getElementById('input-fixed-costs')?.value) || 0;
      const pricePerUnit = parseFloat(document.getElementById('input-unit-price')?.value) || 0;
      const varCostPerUnit = parseFloat(document.getElementById('input-var-cost')?.value) || 0;

      updateLiveLabel('live-fixed-costs', '$' + Number(fixedCost).toLocaleString());
      updateLiveLabel('live-unit-price', '$' + Number(pricePerUnit).toFixed(2));
      updateLiveLabel('live-var-cost', '$' + Number(varCostPerUnit).toFixed(2));

      const cmPerUnit = pricePerUnit - varCostPerUnit;
      let breakEvenUnits = 0;
      let breakEvenRevenue = 0;

      if (cmPerUnit > 0) {
        breakEvenUnits = fixedCost / cmPerUnit;
        breakEvenRevenue = breakEvenUnits * pricePerUnit;
      }

      const cmRatio = pricePerUnit > 0 ? (cmPerUnit / pricePerUnit) * 100 : 0;
      const varRatio = pricePerUnit > 0 ? (varCostPerUnit / pricePerUnit) * 100 : 0;

      document.getElementById('res-primary').textContent = `${Math.ceil(breakEvenUnits).toLocaleString()} Units`;
      document.getElementById('res-stat-1').textContent = formatCurrency(breakEvenRevenue);
      document.getElementById('res-stat-2').textContent = formatCurrency(cmPerUnit);
      document.getElementById('res-stat-3').textContent = `${cmRatio.toFixed(1)}% CM`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(varCostPerUnit);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(breakEvenRevenue);

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${cmRatio.toFixed(1)}% CM Ratio`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${varRatio.toFixed(1)}% Var Ratio`;

      renderDonutChart('chart-container', [
        { label: 'Unit Contribution Margin', value: Math.max(0, cmPerUnit), color: '#10b981' },
        { label: 'Unit Variable Cost', value: varCostPerUnit, color: '#f59e0b' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && cmPerUnit > 0) {
        const multipliers = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
        let html = '';
        multipliers.forEach(mult => {
          const units = Math.ceil(breakEvenUnits * mult);
          const rev = units * pricePerUnit;
          const totalCost = fixedCost + (units * varCostPerUnit);
          const netProfit = rev - totalCost;
          html += `
            <tr>
              <td><strong>${units.toLocaleString()} Units (${Math.round(mult * 100)}%)</strong></td>
              <td>${formatCurrency(rev)}</td>
              <td>${formatCurrency(totalCost)}</td>
              <td style="color:${netProfit >= 0 ? '#10b981' : '#ef4444'};"><strong>${formatCurrency(netProfit)}</strong></td>
            </tr>
          `;
        });
        tableBody.innerHTML = html;
      }
    },

    // 16. Cash Flow Calculator
    cash_flow: function () {
      const inflows = parseFloat(document.getElementById('input-inflows')?.value) || 0;
      const operatingExp = parseFloat(document.getElementById('input-operating-exp')?.value) || 0;
      const debtExp = parseFloat(document.getElementById('input-debt-exp')?.value) || 0;

      updateLiveLabel('live-inflows', '$' + Number(inflows).toLocaleString());
      updateLiveLabel('live-operating-exp', '$' + Number(operatingExp).toLocaleString());
      updateLiveLabel('live-debt-exp', '$' + Number(debtExp).toLocaleString());

      const totalOutflows = operatingExp + debtExp;
      const netCashFlow = inflows - totalOutflows;

      document.getElementById('res-primary').textContent = formatCurrency(netCashFlow);
      document.getElementById('res-stat-1').textContent = formatCurrency(inflows);
      document.getElementById('res-stat-2').textContent = formatCurrency(totalOutflows);
      document.getElementById('res-stat-3').textContent = formatCurrency(debtExp);

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(totalOutflows);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(netCashFlow);

      const inPct = (inflows + totalOutflows) > 0 ? ((inflows / (inflows + totalOutflows)) * 100).toFixed(1) + '%' : '50%';
      const outPct = (inflows + totalOutflows) > 0 ? ((totalOutflows / (inflows + totalOutflows)) * 100).toFixed(1) + '%' : '50%';

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${inPct} Inflows`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${outPct} Outflows`;

      renderDonutChart('chart-container', [
        { label: 'Operating Expenses', value: operatingExp, color: '#ef4444' },
        { label: 'Debt Service', value: debtExp, color: '#f59e0b' },
        { label: 'Net Surplus Cash', value: Math.max(0, netCashFlow), color: '#10b981' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        let html = '';
        let cumReserve = 25000;
        for (let q = 1; q <= 4; q++) {
          const qInflows = inflows * 3;
          const qOutflows = totalOutflows * 3;
          const qNet = netCashFlow * 3;
          cumReserve += qNet;
          html += `
            <tr>
              <td><strong>Quarter ${q}</strong></td>
              <td>${formatCurrency(qInflows)}</td>
              <td>${formatCurrency(qOutflows)}</td>
              <td><strong>${formatCurrency(cumReserve)}</strong></td>
            </tr>
          `;
        }
        tableBody.innerHTML = html;
      }
    },

    // 17. Loan Eligibility (Banking FOIR & DTI Method)
    loan_eligibility: function () {
      const presetSelect = document.getElementById('select-loan-preset');
      const incomeModeSelect = document.getElementById('select-income-mode');
      const incomeInput = document.getElementById('input-income');
      const debtsInput = document.getElementById('input-existing-debts');
      const foirInput = document.getElementById('input-foir');
      const rateInput = document.getElementById('input-elig-rate');
      const tenureInput = document.getElementById('input-elig-tenure');

      if (presetSelect && presetSelect._lastPreset !== presetSelect.value) {
        presetSelect._lastPreset = presetSelect.value;
        if (presetSelect.value === 'home') {
          if (foirInput) foirInput.value = '50';
          if (rateInput) rateInput.value = '8.5';
        } else if (presetSelect.value === 'car') {
          if (foirInput) foirInput.value = '40';
          if (rateInput) rateInput.value = '10.5';
        } else if (presetSelect.value === 'personal') {
          if (foirInput) foirInput.value = '35';
          if (rateInput) rateInput.value = '14.0';
        }
      }

      const incomeMode = incomeModeSelect?.value || 'monthly';
      const rawIncome = parseFloat(incomeInput?.value) || 0;
      const monthlyIncome = incomeMode === 'annual' ? rawIncome / 12 : rawIncome;
      const existingDebts = parseFloat(debtsInput?.value) || 0;
      const foirPct = parseFloat(foirInput?.value) || 50;
      const rate = parseFloat(rateInput?.value) || 8.5;
      const tenureYears = parseFloat(tenureInput?.value) || 20;

      updateLiveLabel('live-income', '$' + Number(rawIncome).toLocaleString());
      updateLiveLabel('live-debts', '$' + Number(existingDebts).toLocaleString());
      updateLiveLabel('live-foir', foirPct + '%');
      updateLiveLabel('live-elig-rate', rate + '%');
      updateLiveLabel('live-elig-tenure', tenureYears + ' Years');

      const maxDebtCapacity = monthlyIncome * (foirPct / 100);
      const availableEmi = Math.max(0, maxDebtCapacity - existingDebts);
      const monthlyRate = rate / 100 / 12;
      const totalMonths = tenureYears * 12;

      let eligibleLoan = 0;
      if (monthlyRate > 0 && availableEmi > 0 && totalMonths > 0) {
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        eligibleLoan = (availableEmi * (factor - 1)) / (monthlyRate * factor);
      } else if (monthlyRate === 0 && availableEmi > 0) {
        eligibleLoan = availableEmi * totalMonths;
      }

      const totalRepayment = availableEmi * totalMonths;
      const totalInterest = Math.max(0, totalRepayment - eligibleLoan);
      const remainingDiscretionary = Math.max(0, monthlyIncome - maxDebtCapacity);

      document.getElementById('res-primary').textContent = formatCurrency(eligibleLoan);
      document.getElementById('res-stat-1').textContent = formatCurrency(availableEmi);
      document.getElementById('res-stat-2').textContent = `${foirPct}% DTI Limit`;
      document.getElementById('res-stat-3').textContent = formatCurrency(monthlyIncome);

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(totalInterest);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatCurrency(totalRepayment);

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = formatCurrency(eligibleLoan);

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = formatCurrency(totalInterest);

      renderDonutChart('chart-container', [
        { label: 'Max Allowed Loan EMI', value: availableEmi, color: '#10b981' },
        { label: 'Existing Debt EMIs', value: existingDebts, color: '#f43f5e' },
        { label: 'Discretionary Income', value: remainingDiscretionary, color: '#94a3b8' }
      ]);

      // Amortization Schedule Table
      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && eligibleLoan > 0) {
        let balance = eligibleLoan;
        let html = '';
        for (let yr = 1; yr <= tenureYears; yr++) {
          let yrInterest = 0;
          let yrPrincipal = 0;
          for (let m = 1; m <= 12; m++) {
            const mInterest = balance * monthlyRate;
            const mPrincipal = Math.min(balance, availableEmi - mInterest);
            yrInterest += mInterest;
            yrPrincipal += mPrincipal;
            balance -= mPrincipal;
          }
          html += `
            <tr>
              <td><strong>Year ${yr}</strong></td>
              <td>${formatCurrency(yrPrincipal)}</td>
              <td>${formatCurrency(yrInterest)}</td>
              <td><strong>${formatCurrency(Math.max(0, balance))}</strong></td>
            </tr>
          `;
        }
        tableBody.innerHTML = html;
      }
    },

    // 18. Body Fat Calculator (US Navy Anthropometric Method)
    body_fat: function () {
      const genderSelect = document.getElementById('select-gender');
      const gender = genderSelect?.value || 'male';
      const height = parseFloat(document.getElementById('input-height')?.value) || 180;
      const weight = parseFloat(document.getElementById('input-weight')?.value) || 80;
      const neck = parseFloat(document.getElementById('input-neck')?.value) || 40;
      const waist = parseFloat(document.getElementById('input-waist')?.value) || 90;
      const hip = parseFloat(document.getElementById('input-hip')?.value) || 100;

      // Toggle Hip field for females
      const hipWrap = document.getElementById('field-hip-wrap');
      if (hipWrap) {
        hipWrap.style.display = gender === 'female' ? 'block' : 'none';
      }

      updateLiveLabel('live-height', height + ' cm');
      updateLiveLabel('live-weight', weight + ' kg');
      updateLiveLabel('live-neck', neck + ' cm');
      updateLiveLabel('live-waist', waist + ' cm');
      updateLiveLabel('live-hip', hip + ' cm');

      let bf = 0;
      if (gender === 'male') {
        const diff = waist - neck;
        if (diff > 0 && height > 0) {
          bf = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(height)) - 450;
        }
      } else {
        const diff = waist + hip - neck;
        if (diff > 0 && height > 0) {
          bf = 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.22100 * Math.log10(height)) - 450;
        }
      }

      bf = Math.max(2, Math.min(65, bf));

      let category = 'Average';
      if (gender === 'male') {
        if (bf < 6) category = 'Essential Fat (2-5%)';
        else if (bf < 14) category = 'Athletes (6-13%)';
        else if (bf < 18) category = 'Fitness (14-17%)';
        else if (bf < 25) category = 'Average (18-24%)';
        else category = 'Obese (25%+)';
      } else {
        if (bf < 14) category = 'Essential Fat (10-13%)';
        else if (bf < 21) category = 'Athletes (14-20%)';
        else if (bf < 25) category = 'Fitness (21-24%)';
        else if (bf < 32) category = 'Average (25-31%)';
        else category = 'Obese (32%+)';
      }

      const fatMass = (weight * bf) / 100;
      const leanMass = Math.max(0, weight - fatMass);

      document.getElementById('res-primary').textContent = `${bf.toFixed(1)}%`;
      document.getElementById('res-stat-1').textContent = `${leanMass.toFixed(1)} kg`;
      document.getElementById('res-stat-2').textContent = category;
      document.getElementById('res-stat-3').textContent = `${fatMass.toFixed(1)} kg`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = `${fatMass.toFixed(1)} kg`;

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = `${weight.toFixed(1)} kg`;

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${((leanMass / weight) * 100).toFixed(1)}%`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${bf.toFixed(1)}%`;

      renderDonutChart('chart-container', [
        { label: 'Lean Muscle Mass', value: leanMass, color: '#10b981' },
        { label: 'Body Fat Mass', value: fatMass, color: '#f43f5e' }
      ]);

      // Category Reference Table
      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        tableBody.innerHTML = `
          <tr><td><strong>Essential Fat</strong></td><td>2% - 5%</td><td>10% - 13%</td><td>Minimum physiological baseline</td></tr>
          <tr><td><strong>Athletes</strong></td><td>6% - 13%</td><td>14% - 20%</td><td>High muscle definition</td></tr>
          <tr><td><strong>Fitness</strong></td><td>14% - 17%</td><td>21% - 24%</td><td>Optimal athletic conditioning</td></tr>
          <tr><td><strong>Average</strong></td><td>18% - 24%</td><td>25% - 31%</td><td>Healthy standard range</td></tr>
          <tr><td><strong>Obese</strong></td><td>25%+</td><td>32%+</td><td>Elevated metabolic health risk</td></tr>
        `;
      }
    },

    // 19. Pregnancy Due Date Calculator (Naegele's Rule & Conception Tracking)
    pregnancy: function () {
      const methodSelect = document.getElementById('select-method');
      const method = methodSelect?.value || 'lmp';

      const lmpWrap = document.getElementById('field-lmp-wrap');
      const conceptionWrap = document.getElementById('field-conception-wrap');

      if (lmpWrap && conceptionWrap) {
        lmpWrap.style.display = method === 'lmp' ? 'block' : 'none';
        conceptionWrap.style.display = method === 'conception' ? 'block' : 'none';
      }

      const cycleLen = parseInt(document.getElementById('input-cycle-len')?.value || '28');
      updateLiveLabel('live-cycle-len', cycleLen + ' Days');

      const today = new Date();
      const formatDateInput = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      const parseLocalDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }
        return new Date(dateStr);
      };

      // Set intelligent default dates (8 weeks ago for LMP, 6 weeks ago for conception)
      const inputLmp = document.getElementById('input-lmp');
      if (inputLmp && !inputLmp.value) {
        const defaultLmp = new Date(today.getTime() - (56 * 86400000));
        inputLmp.value = formatDateInput(defaultLmp);
      }

      const inputConception = document.getElementById('input-conception-date');
      if (inputConception && !inputConception.value) {
        const defaultConc = new Date(today.getTime() - (42 * 86400000));
        inputConception.value = formatDateInput(defaultConc);
      }

      let due = new Date();
      let conception = new Date();
      let lmpDate = new Date();

      if (method === 'lmp') {
        const parsedLmp = parseLocalDate(inputLmp?.value);
        if (!parsedLmp || isNaN(parsedLmp.getTime())) return;
        lmpDate = parsedLmp;

        // Naegele's rule with cycle adjustment: LMP + 280 days + (cycleLen - 28)
        due = new Date(lmpDate.getTime() + (280 + (cycleLen - 28)) * 86400000);
        conception = new Date(lmpDate.getTime() + (cycleLen - 14) * 86400000);
      } else {
        const parsedConc = parseLocalDate(inputConception?.value);
        if (!parsedConc || isNaN(parsedConc.getTime())) return;
        conception = parsedConc;

        // Due date = Conception + 266 days
        due = new Date(conception.getTime() + (266 * 86400000));
        lmpDate = new Date(conception.getTime() - (14 * 86400000));
      }

      const diffTime = today.getTime() - lmpDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffTime / 86400000));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      const daysRemaining = Math.max(0, Math.floor((due.getTime() - today.getTime()) / 86400000));

      let trimester = '1st Trimester';
      if (weeks >= 27) trimester = '3rd Trimester';
      else if (weeks >= 13) trimester = '2nd Trimester';

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const shortOptions = { year: 'numeric', month: 'short', day: 'numeric' };

      document.getElementById('res-primary').textContent = due.toLocaleDateString('en-US', options);
      document.getElementById('res-stat-1').textContent = `${weeks} Weeks, ${days} Days`;
      document.getElementById('res-stat-2').textContent = trimester;
      document.getElementById('res-stat-3').textContent = `${daysRemaining} Days Left`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = conception.toLocaleDateString('en-US', shortOptions);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = due.toLocaleDateString('en-US', shortOptions);

      const pctCompleted = Math.min(100, Math.round((diffDays / 280) * 100));
      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${pctCompleted}% Completed`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${100 - pctCompleted}% Remaining`;

      renderDonutChart('chart-container', [
        { label: `Completed (${weeks}w ${days}d)`, value: Math.min(280, diffDays), color: '#8b5cf6' },
        { label: `Remaining (${daysRemaining}d)`, value: daysRemaining, color: '#e2e8f0' }
      ]);

      // Milestone Reference Table
      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody) {
        const d4 = new Date(lmpDate.getTime() + 4 * 7 * 86400000).toLocaleDateString('en-US', shortOptions);
        const d8 = new Date(lmpDate.getTime() + 8 * 7 * 86400000).toLocaleDateString('en-US', shortOptions);
        const d12 = new Date(lmpDate.getTime() + 12 * 7 * 86400000).toLocaleDateString('en-US', shortOptions);
        const d20 = new Date(lmpDate.getTime() + 20 * 7 * 86400000).toLocaleDateString('en-US', shortOptions);
        const d27 = new Date(lmpDate.getTime() + 27 * 7 * 86400000).toLocaleDateString('en-US', shortOptions);
        const d37 = new Date(lmpDate.getTime() + 37 * 7 * 86400000).toLocaleDateString('en-US', shortOptions);
        const d40 = due.toLocaleDateString('en-US', shortOptions);

        tableBody.innerHTML = `
          <tr><td><strong>Week 4 (${d4})</strong></td><td>Implantation & Positive Test</td><td>Size of Poppy Seed</td><td>Embryonic development begins</td></tr>
          <tr><td><strong>Week 8 (${d8})</strong></td><td>Heartbeat Detectable</td><td>Size of Raspberry</td><td>Facial features & limb buds form</td></tr>
          <tr><td><strong>Week 12 (${d12})</strong></td><td>End of 1st Trimester</td><td>Size of Plum</td><td>All critical organs fully structured</td></tr>
          <tr><td><strong>Week 20 (${d20})</strong></td><td>Midway Anatomy Ultrasound</td><td>Size of Banana</td><td>Baby movements (quickening) felt</td></tr>
          <tr><td><strong>Week 27 (${d27})</strong></td><td>Start of 3rd Trimester</td><td>Size of Cauliflower</td><td>Viability milestone reached</td></tr>
          <tr><td><strong>Week 37 (${d37})</strong></td><td>Early Full-Term</td><td>Size of Winter Melon</td><td>Lungs and nervous system mature</td></tr>
          <tr><td><strong>Week 40 (${d40})</strong></td><td>Estimated Due Date (EDD)</td><td>Size of Watermelon</td><td>Arrival timeline complete</td></tr>
        `;
      }
    },

    // 20. Currency & Purchasing Power
    currency: function () {
      const amount = parseFloat(document.getElementById('input-amount')?.value) || 0;
      const rate = parseFloat(document.getElementById('input-rate')?.value) || 1;
      const feePct = parseFloat(document.getElementById('input-fee')?.value) || 0;

      const fee = (amount * feePct) / 100;
      const netAmount = amount - fee;
      const converted = netAmount * rate;

      document.getElementById('res-primary').textContent = formatNumber(converted, 2);
      document.getElementById('res-stat-1').textContent = formatCurrency(amount);
      document.getElementById('res-stat-2').textContent = formatCurrency(fee);
      document.getElementById('res-stat-3').textContent = `1 : ${rate}`;

      const elBreakdownInterest = document.getElementById('res-breakdown-interest');
      if (elBreakdownInterest) elBreakdownInterest.textContent = formatCurrency(fee);

      const elBreakdownTotal = document.getElementById('res-breakdown-total');
      if (elBreakdownTotal) elBreakdownTotal.textContent = formatNumber(converted, 2);

      const netPct = amount > 0 ? (((amount - fee) / amount) * 100).toFixed(1) + '%' : '100%';
      const feePctStr = feePct.toFixed(1) + '%';

      const elPctPrincipal = document.getElementById('res-pct-principal');
      if (elPctPrincipal) elPctPrincipal.textContent = `${netPct} Net Output`;

      const elPctInterest = document.getElementById('res-pct-interest');
      if (elPctInterest) elPctInterest.textContent = `${feePctStr} Bank Fee`;

      renderDonutChart('chart-container', [
        { label: 'Converted Output Value', value: converted, color: '#10b981' },
        { label: 'Transfer Spread & Fees', value: fee * rate, color: '#ef4444' }
      ]);

      const tableBody = document.getElementById('schedule-table-body');
      if (tableBody && amount > 0) {
        const pairs = [
          { pair: 'EUR (Euro)', rate: 0.92, symbol: '€' },
          { pair: 'GBP (British Pound)', rate: 0.79, symbol: '£' },
          { pair: 'JPY (Japanese Yen)', rate: 154.50, symbol: '¥' },
          { pair: 'CAD (Canadian Dollar)', rate: 1.36, symbol: 'CA$' },
          { pair: 'AUD (Australian Dollar)', rate: 1.52, symbol: 'A$' },
          { pair: 'INR (Indian Rupee)', rate: 83.45, symbol: '₹' },
          { pair: 'CHF (Swiss Franc)', rate: 0.89, symbol: 'CHF' }
        ];
        let html = '';
        pairs.forEach(p => {
          const out = (amount * (1 - (feePct / 100))) * p.rate;
          html += `
            <tr>
              <td><strong>${p.pair}</strong></td>
              <td>1 USD = ${p.rate.toFixed(4)}</td>
              <td>${feePct}% Fee</td>
              <td><strong>${p.symbol} ${out.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
            </tr>
          `;
        });
        tableBody.innerHTML = html;
      }
    }
  };

  // Bind Listeners & Sliders
  document.addEventListener('DOMContentLoaded', () => {
    const calcWorkspace = document.querySelector('[data-calculator-type]');
    if (!calcWorkspace) return;

    const calcType = calcWorkspace.getAttribute('data-calculator-type');
    const runner = CalculatorEngines[calcType] || CalculatorEngines.loan;

    // Sync dual controls: Range Sliders <-> Number Inputs
    document.querySelectorAll('.calc-form-group').forEach((group) => {
      const numberInput = group.querySelector('input[type="number"], .input-text-box, .calc-number-input');
      const slider = group.querySelector('.calc-range-slider');

      if (numberInput && slider) {
        slider.addEventListener('input', () => {
          numberInput.value = slider.value;
          runner();
        });

        numberInput.addEventListener('input', () => {
          slider.value = numberInput.value;
          runner();
        });
      } else if (numberInput) {
        numberInput.addEventListener('input', runner);
      }

      const select = group.querySelector('select');
      if (select) {
        select.addEventListener('change', runner);
      }

      const dateInput = group.querySelector('input[type="date"]');
      if (dateInput) {
        dateInput.addEventListener('change', runner);
      }
    });

    // Initial calculation run
    runner();
  });
})();
