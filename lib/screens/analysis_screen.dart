import 'package:flutter/material.dart';
import '../models/sample_data.dart';

class AnalysisScreen extends StatelessWidget {
  const AnalysisScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final assets = SampleData.assets;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wealth Console'),
        backgroundColor: Colors.transparent,
        foregroundColor: Theme.of(context).colorScheme.primary,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _OverviewRow(),
            const SizedBox(height: 12),
            _PerformanceCard(),
            const SizedBox(height: 12),
            _RiskCard(),
            const SizedBox(height: 12),
            _InsightsGrid(),
            const SizedBox(height: 12),
            _AssetTable(assets: assets),
          ]),
        ),
      ),
      bottomNavigationBar: const SizedBox(height: 60),
    );
  }
}

class _OverviewRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: const [Text('Wealth Console', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700)), SizedBox(height: 4), Text('AI-Engine Status: Optimal Precision', style: TextStyle(color: Colors.grey))]),
      Card(child: Padding(padding: const EdgeInsets.all(8.0), child: Column(children: const [Text('Total Equity', style: TextStyle(fontSize: 12, color: Colors.grey)), SizedBox(height: 4), Text('\$1,248,392.42', style: TextStyle(fontWeight: FontWeight.bold))]))),
    ]);
  }
}

class _PerformanceCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Row(children: [Container(width: 8, height: 8, decoration: const BoxDecoration(color: Color(0xFF006C47), shape: BoxShape.circle)), const SizedBox(width: 8), const Text('Performance Forecast', style: TextStyle(fontWeight: FontWeight.w700))]), Row(children: [TextButton(onPressed: () {}, child: const Text('1D')), ElevatedButton(onPressed: () {}, child: const Text('1W')), TextButton(onPressed: () {}, child: const Text('1M'))])]),
          const SizedBox(height: 12),
          SizedBox(height: 200, child: Center(child: Text('Chart placeholder', style: TextStyle(color: Colors.grey.shade400))))
        ]),
      ),
    );
  }
}

class _RiskCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Risk Intelligence', style: TextStyle(fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          Center(child: Column(children: const [Text('32', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700)), Text('MODERATE', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green))])),
          const SizedBox(height: 12),
          const Text('Volatility Index'),
          const SizedBox(height: 6),
          LinearProgressIndicator(value: 0.12, color: Colors.green),
          const SizedBox(height: 12),
          const Text('Asset Diversification'),
          const SizedBox(height: 6),
          LinearProgressIndicator(value: 0.82, color: Colors.blue),
        ]),
      ),
    );
  }
}

class _InsightsGrid extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final items = SampleData.insights;
    return GridView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: items.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 1, childAspectRatio: 3),
      itemBuilder: (context, index) {
        final it = items[index];
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(children: [Icon(it.icon, color: Theme.of(context).colorScheme.primary), const SizedBox(width: 12), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(it.title, style: const TextStyle(fontWeight: FontWeight.w700)), Text(it.body, style: const TextStyle(color: Colors.grey))])), Column(mainAxisAlignment: MainAxisAlignment.end, children: [Text(it.value, style: const TextStyle(fontWeight: FontWeight.bold))])]),
          ),
        );
      },
    );
  }
}

class _AssetTable extends StatelessWidget {
  final List<Map<String, String>> assets;
  const _AssetTable({required this.assets});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.all(12.0),
        child: DataTable(columns: const [
          DataColumn(label: Text('Asset Name')),
          DataColumn(label: Text('Allocation')),
          DataColumn(label: Text('Price')),
          DataColumn(label: Text('24h Change')),
          DataColumn(label: Text('Value')),
        ], rows: assets.map((a) {
          return DataRow(cells: [
            DataCell(Row(children: [CircleAvatar(backgroundColor: Colors.green.shade50, child: Icon(Icons.currency_bitcoin, color: Colors.green)), const SizedBox(width: 8), Text(a['name'] ?? '')])),
            DataCell(Text(a['allocation'] ?? '')),
            DataCell(Text(a['price'] ?? '')),
            DataCell(Text(a['change'] ?? '')),
            DataCell(Text(a['value'] ?? '')),
          ]);
        }).toList()),
      ),
    );
  }
}
