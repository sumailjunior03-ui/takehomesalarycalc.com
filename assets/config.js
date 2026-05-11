window.SITE_CONFIG = {
  domain: 'takehomesalarycalc.com',
  siteName: 'TakeHomeSalaryCalc.com',
  title: 'Net Salary Calculator',
  partnershipsEmail: 'partnerships@calc-hq.com',
  buildDate: '2026-05-11',
  taxYearLabel: '2026 tax-year estimate',
  adsensePublisherId: 'ca-pub-7744853829365165',
  federalTaxData: {
    standardDeduction: {
      single: 16100,
      married: 32200,
      hoh: 24150
    },
    brackets: {
      single: [
        { upTo: 12400, rate: 0.10 },
        { upTo: 50400, rate: 0.12 },
        { upTo: 105700, rate: 0.22 },
        { upTo: 201775, rate: 0.24 },
        { upTo: 256225, rate: 0.32 },
        { upTo: 640600, rate: 0.35 },
        { upTo: null, rate: 0.37 }
      ],
      married: [
        { upTo: 24800, rate: 0.10 },
        { upTo: 100800, rate: 0.12 },
        { upTo: 211400, rate: 0.22 },
        { upTo: 403550, rate: 0.24 },
        { upTo: 512450, rate: 0.32 },
        { upTo: 768700, rate: 0.35 },
        { upTo: null, rate: 0.37 }
      ],
      hoh: [
        { upTo: 17700, rate: 0.10 },
        { upTo: 67450, rate: 0.12 },
        { upTo: 105700, rate: 0.22 },
        { upTo: 201775, rate: 0.24 },
        { upTo: 256200, rate: 0.32 },
        { upTo: 640600, rate: 0.35 },
        { upTo: null, rate: 0.37 }
      ]
    },
    fica: {
      socialSecurityRate: 0.062,
      socialSecurityWageBase: 184500,
      medicareRate: 0.0145,
      additionalMedicareRate: 0.009,
      additionalMedicareThreshold: 200000
    }
  },
  adsActive: false
};
