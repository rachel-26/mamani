class SampleData {
  static double netWorth = 482910.45;

  static final predictions = [
    _Pred('Next 30 days', 'Predicted Savings', '+\$450.00'),
    _Pred('Market Alert', 'Portfolio Growth', '+12.8%'),
    _Pred('Tax Optimization', 'Available Credit', '\$2,100'),
  ];

  static final insights = [
    {'title': 'Energy Transition Surge', 'body': 'Renewable infrastructure assets are showing strong signals', 'value': '+14.2%'}
  ];

  static final assets = [
    {'name': 'Bitcoin (BTC)', 'allocation': '42%', 'price': '\$68,241.02', 'change': '+4.82%', 'value': '\$524,324.66'},
    {'name': 'REIT Global (GLRE)', 'allocation': '28%', 'price': '\$142.10', 'change': '-0.42%', 'value': '\$349,550.00'},
    {'name': 'Nvidia Corp (NVDA)', 'allocation': '15%', 'price': '\$882.23', 'change': '+1.12%', 'value': '\$187,258.83'},
  ];
}

class _Pred {
  final String title;
  final String subtitle;
  final String value;
  _Pred(this.title, this.subtitle, this.value);
}
