import 'package:flutter/material.dart';
import '../models/sample_data.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final data = SampleData.netWorth;
    return Scaffold(
      appBar: AppBar(
        title: const Text('SmartFinance'),
        centerTitle: false,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _NetWorthCard(value: data),
              const SizedBox(height: 16),
              const _AIPredictions(),
              const SizedBox(height: 16),
              const _DailyFocusGrid(),
              const SizedBox(height: 16),
              const _ProjectedGrowthPlaceholder(),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _BottomNav(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, '/log'),
        child: const Icon(Icons.smart_toy),
      ),
    );
  }
}

class _NetWorthCard extends StatelessWidget {
  final double value;
  const _NetWorthCard({required this.value});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Total Net Worth', style: TextStyle(letterSpacing: 1.2)),
                Row(children: const [Icon(Icons.circle, size: 10, color: Colors.green), SizedBox(width: 6), Text('AI SYNCED', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12))])
              ],
            ),
            const SizedBox(height: 12),
            Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
              const Text('\$', style: TextStyle(fontSize: 28)),
              const SizedBox(width: 6),
              Text(value.toStringAsFixed(2), style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700)),
            ])
          ],
        ),
      ),
    );
  }
}

class _AIPredictions extends StatelessWidget {
  const _AIPredictions();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 130,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: SampleData.predictions.length,
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final p = SampleData.predictions[index];
          return SizedBox(
            width: 220,
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(p.title.toUpperCase(), style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.grey)),
                  const SizedBox(height: 6),
                  Text(p.subtitle, style: const TextStyle(fontWeight: FontWeight.w600)),
                  const Spacer(),
                  Text(p.value, style: TextStyle(color: Theme.of(context).colorScheme.primary, fontSize: 18, fontWeight: FontWeight.bold)),
                ]),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _DailyFocusGrid extends StatelessWidget {
  const _DailyFocusGrid();

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: MediaQuery.of(context).size.width > 600 ? 2 : 1,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: const [
        _FocusCard(icon: Icons.priority_high, title: 'Budget Overrun', subtitle: 'Dining category is 15% over limit'),
        _FocusCard(icon: Icons.flight, title: 'Europe Trip Fund', subtitle: '82% - On track to reach \$5,000 by June'),
        _FocusCard(icon: Icons.calendar_today, title: 'Rent Due Tomorrow', subtitle: 'Automated payment scheduled: \$2,400'),
        _FocusCard(icon: Icons.credit_score, title: 'Score Improved', subtitle: 'Your credit score went up 12 points'),
      ],
    );
  }
}

class _FocusCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  const _FocusCard({required this.icon, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(children: [
          Container(width: 48, height: 48, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(8)), child: Icon(icon, color: Theme.of(context).colorScheme.primary)),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: const TextStyle(fontWeight: FontWeight.w700)), Text(subtitle, style: const TextStyle(color: Colors.grey))]))
        ]),
      ),
    );
  }
}

class _ProjectedGrowthPlaceholder extends StatelessWidget {
  const _ProjectedGrowthPlaceholder();

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Projected Growth', style: TextStyle(fontWeight: FontWeight.w700)), Row(children: [ElevatedButton(onPressed: () {}, child: const Text('1Y')), const SizedBox(width: 8), TextButton(onPressed: () {}, child: const Text('5Y'))])]),
          const SizedBox(height: 12),
          SizedBox(height: 120, child: Center(child: Text('Chart placeholder', style: TextStyle(color: Colors.grey.shade400))))
        ]),
      ),
    );
  }
}

class _BottomNav extends StatelessWidget implements PreferredSizeWidget {
  @override
  Size get preferredSize => const Size.fromHeight(60);

  @override
  Widget build(BuildContext context) {
    return BottomAppBar(
      shape: const CircularNotchedRectangle(),
      notchMargin: 6,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(onPressed: () {}, icon: const Icon(Icons.account_balance_wallet, color: Colors.green)),
            IconButton(onPressed: () => Navigator.pushNamed(context, '/analysis'), icon: const Icon(Icons.analytics, color: Colors.grey)),
            const SizedBox(width: 48),
            IconButton(onPressed: () {}, icon: const Icon(Icons.query_stats, color: Colors.grey)),
            IconButton(onPressed: () {}, icon: const Icon(Icons.lock, color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
