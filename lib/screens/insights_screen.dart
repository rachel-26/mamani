import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/bottom_nav_bar.dart';

class InsightsScreen extends StatefulWidget {
  const InsightsScreen({super.key});

  @override
  State<InsightsScreen> createState() => _InsightsScreenState();
}

class _InsightsScreenState extends State<InsightsScreen> {
  int _selectedNavIndex = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                _buildHeader(),
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      _buildOverviewRow(),
                      const SizedBox(height: 24),
                      _buildExpenseBreakdownChart(),
                      const SizedBox(height: 24),
                      _buildAIGrowthSuggestions(),
                      const SizedBox(height: 100),
                    ]),
                  ),
                ),
              ],
            ),
            Positioned(
              bottom: 0, left: 0, right: 0,
              child: BottomNavBar(selectedIndex: _selectedNavIndex, onTap: (index) {
                setState(() => _selectedNavIndex = index);
                _navigateToScreen(index);
              }),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 40, 24, 16),
      decoration: const BoxDecoration(color: Colors.white, border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9)))),
      child: Row(children: [
        IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF64748B)), padding: EdgeInsets.zero),
        const SizedBox(width: 16),
        Text('Monthly Insights', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
        const Spacer(),
        const Icon(Icons.calendar_month, color: Color(0xFF64748B), size: 24),
      ]),
    );
  }

  Widget _buildOverviewRow() {
    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Expense Breakdown', style: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
        const SizedBox(height: 4),
        Text('October 2023', style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF94A3B8))),
      ]),
      Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6), decoration: BoxDecoration(color: const Color(0xFFEEF2FF), borderRadius: BorderRadius.circular(20)),
        child: Text('-12% vs Sept', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: const Color(0xFF4F46E5)))),
    ]);
  }

  Widget _buildExpenseBreakdownChart() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 4))]),
      child: Column(children: [
        Container(height: 256, width: double.infinity, decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(16)),
          child: Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Text('\$2,840', style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
            Text('Total Spent', style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF94A3B8))),
          ]))),
        const SizedBox(height: 32),
        Row(children: [
          Expanded(child: Column(children: [
            _LegendItem(color: const Color(0xFF6366F1), label: 'Housing', percentage: '35%'),
            const SizedBox(height: 16),
            _LegendItem(color: const Color(0xFF22D3EE), label: 'Transport', percentage: '15%'),
          ])),
          Expanded(child: Column(children: [
            _LegendItem(color: const Color(0xFFFB7185), label: 'Food', percentage: '25%'),
            const SizedBox(height: 16),
            _LegendItem(color: const Color(0xFFFBBF24), label: 'Leisure', percentage: '20%'),
          ])),
        ]),
      ]),
    );
  }

  Widget _buildAIGrowthSuggestions() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Row(children: [
          const Text('✨ ', style: TextStyle(fontSize: 20)),
          Text('AI Growth Suggestions', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
        ]),
        TextButton(onPressed: () {}, child: Text('Refresh', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF4F46E5)))),
      ]),
      const SizedBox(height: 16),
      _SuggestionCard1(),
      const SizedBox(height: 16),
      _SuggestionCard(icon: Icons.warning_amber_rounded, iconColor: const Color(0xFFD97706), bgColor: const Color(0xFFFEF3C7), title: 'Subscription Alert', body: 'We found 3 overlapping streaming services. Cancelling the least used could save you \$24/month.'),
      const SizedBox(height: 16),
      _SuggestionCard(icon: Icons.trending_up, iconColor: const Color(0xFF059669), bgColor: const Color(0xFFD1FAE5), title: 'Optimize Cash Flow', body: 'Your "Rent" is paid mid-month. Moving some utility payments to the 25th would help balance your weekly budget.'),
    ]);
  }

  void _navigateToScreen(int index) {
    switch (index) {
      case 0: Navigator.pushReplacementNamed(context, '/dashboard'); break;
      case 3: Navigator.pushReplacementNamed(context, '/goals'); break;
    }
  }
}

class _LegendItem extends StatelessWidget {
  final Color color;
  final String label;
  final String percentage;
  const _LegendItem({required this.color, required this.label, required this.percentage});

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      Container(width: 12, height: 12, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
      const SizedBox(width: 12),
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B))),
        Text(percentage, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
      ]),
    ]);
  }
}

class _SuggestionCard1 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFF4F46E5)]), borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: const Color(0xFF6366F1).withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))]),
      child: Stack(children: [
        Positioned(right: -16, top: -16, child: Icon(Icons.star, size: 96, color: Colors.white.withOpacity(0.2))),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Goal Accelerator', style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
          const SizedBox(height: 8),
          Text("You've spent 25% less on \"Food\" this week. Redirect the saved \$120 to your \"Summer Vacation\" goal to reach it 2 weeks earlier!",
            style: GoogleFonts.inter(fontSize: 14, color: Colors.white, height: 1.5)),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: () {}, style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF4F46E5), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8)),
            child: Text('Apply Now', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1))),
        ]),
      ]),
    );
  }
}

class _SuggestionCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color bgColor;
  final String title;
  final String body;
  const _SuggestionCard({required this.icon, required this.iconColor, required this.bgColor, required this.title, required this.body});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 6, offset: const Offset(0, 4))]),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(16)),
          child: Icon(icon, color: iconColor, size: 24)),
        const SizedBox(width: 16),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
          const SizedBox(height: 4),
          Text(body, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF64748B), height: 1.5)),
        ])),
      ]),
    );
  }
}