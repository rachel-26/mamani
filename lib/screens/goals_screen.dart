import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/transaction.dart';
import '../widgets/bottom_nav_bar.dart';

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  int _selectedNavIndex = 3;

  List<Goal> _getShortTermGoals() => [
    Goal(id: '1', title: 'Summer Vacation', targetAmount: 2000.00, savedAmount: 1500.00, targetDate: DateTime(2024, 8, 1), isShortTerm: true, colorIndex: 0),
    Goal(id: '2', title: 'New iPhone 15', targetAmount: 1000.00, savedAmount: 300.00, targetDate: DateTime(2023, 12, 1), isShortTerm: true, colorIndex: 1),
  ];

  List<Goal> _getLongTermGoals() => [
    Goal(id: '3', title: 'Retirement Fund', targetAmount: 40000.00, savedAmount: 10000.00, targetDate: DateTime(2050, 1, 1), isShortTerm: false, colorIndex: 2),
    Goal(id: '4', title: 'Apartment Deposit', targetAmount: 5000.00, savedAmount: 650.00, targetDate: DateTime(2026, 6, 1), isShortTerm: false, colorIndex: 3),
  ];

  double get _totalSaved => [..._getShortTermGoals(), ..._getLongTermGoals()].fold(0, (sum, g) => sum + g.savedAmount);
  double get _totalTarget => [..._getShortTermGoals(), ..._getLongTermGoals()].fold(0, (sum, g) => sum + g.targetAmount);
  double get _overallProgress => _totalSaved / _totalTarget;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
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
                      _buildTotalSavingsCard(),
                      const SizedBox(height: 24),
                      _buildSectionTitle('Short-Term Goals', 'Active'),
                      const SizedBox(height: 16),
                      ..._getShortTermGoals().map((g) => _GoalCard(goal: g)),
                      const SizedBox(height: 24),
                      _buildSectionTitle('Long-Term Goals'),
                      const SizedBox(height: 16),
                      ..._getLongTermGoals().map((g) => _GoalCard(goal: g)),
                      const SizedBox(height: 24),
                      _buildGrowthSuggestion(),
                      const SizedBox(height: 120),
                    ]),
                  ),
                ),
              ],
            ),
            Positioned(bottom: 96, right: 16, child: _buildAddGoalFAB()),
            Positioned(bottom: 0, left: 0, right: 0, child: BottomNavBar(selectedIndex: _selectedNavIndex, onTap: (index) {
              setState(() => _selectedNavIndex = index);
              _navigateToScreen(index);
            })),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 40, 24, 16),
      decoration: const BoxDecoration(color: Colors.white, border: Border(bottom: BorderSide(color: Color(0xFFE5E7EB)))),
      child: Row(children: [
        IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF64748B)), padding: EdgeInsets.zero),
        Text('Financial Goals', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
        const Spacer(),
        TextButton(onPressed: () {}, child: Text('History', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF2563EB)))),
      ]),
    );
  }

  Widget _buildTotalSavingsCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF4F46E5)]), borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: const Color(0xFF2563EB).withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Total Saved Toward Goals', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFFBFDBFE))),
        const SizedBox(height: 8),
        RichText(text: TextSpan(children: [
          TextSpan(text: '\$${_totalSaved.toStringAsFixed(2)}', style: GoogleFonts.inter(fontSize: 30, fontWeight: FontWeight.w700, color: Colors.white)),
          TextSpan(text: ' of \$${_totalTarget.toStringAsFixed(0)}', style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFFBFDBFE))),
        ])),
        const SizedBox(height: 16),
        ClipRRect(borderRadius: BorderRadius.circular(4), child: LinearProgressIndicator(value: _overallProgress, minHeight: 8, backgroundColor: Colors.white.withOpacity(0.2), valueColor: const AlwaysStoppedAnimation<Color>(Colors.white))),
        const SizedBox(height: 8),
        Text("You're ${(_overallProgress * 100).toInt()}% towards your total objectives!", style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFFBFDBFE))),
      ]),
    );
  }

  Widget _buildSectionTitle(String title, [String? badge]) {
    return Row(children: [
      Text(title, style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFF1F2937))),
      if (badge != null) ...[
        const SizedBox(width: 12),
        Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: const Color(0xFFDBEAFE), borderRadius: BorderRadius.circular(16)),
          child: Text(badge, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF1D4ED8)))),
      ],
    ]);
  }

  Widget _buildAddGoalFAB() {
    return FloatingActionButton.extended(
      onPressed: () {},
      backgroundColor: const Color(0xFF4F46E5),
      elevation: 8,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      icon: const Icon(Icons.add, color: Colors.white),
      label: Text('Add Goal', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.w600)),
    );
  }

  Widget _buildGrowthSuggestion() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: const Color(0xFFFEFCE8), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFFDE68A))),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(width: 40, height: 40, decoration: BoxDecoration(color: const Color(0xFFFACC15), borderRadius: BorderRadius.circular(20)),
          child: const Icon(Icons.lightbulb, color: Colors.white, size: 24)),
        const SizedBox(width: 16),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Financial Growth Insight', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF854D0E))),
          const SizedBox(height: 4),
          Text('Reducing your "Dining Out" expenses by 15% this month could put you 2 months ahead of your Summer Vacation goal!',
            style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFFA16207), height: 1.5)),
        ])),
      ]),
    );
  }

  void _navigateToScreen(int index) {
    switch (index) {
      case 0: Navigator.pushReplacementNamed(context, '/dashboard'); break;
      case 1: Navigator.pushReplacementNamed(context, '/insights'); break;
    }
  }
}

class _GoalCard extends StatelessWidget {
  final Goal goal;
  const _GoalCard({required this.goal});

  Color _getColor() => [const Color(0xFFEA580C), const Color(0xFF7C3AED), const Color(0xFF059669), const Color(0xFFE11D48)][goal.colorIndex % 4];
  Color _getBgColor() => [const Color(0xFFFFEDD5), const Color(0xFFF3E8FF), const Color(0xFFD1FAE5), const Color(0xFFFFE4E6)][goal.colorIndex % 4];
  IconData _getIcon() => [Icons.star, Icons.phone_iphone, Icons.account_balance, Icons.home_work][goal.colorIndex % 4];

  String _formatDate(DateTime date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return goal.isShortTerm ? '${months[date.month - 1]} ${date.year}' : 'Year ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFF3F4F6)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))]),
      child: Column(children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Row(children: [
            Container(width: 40, height: 40, decoration: BoxDecoration(color: _getBgColor(), borderRadius: BorderRadius.circular(12)),
              child: Icon(_getIcon(), color: _getColor(), size: 24)),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(goal.title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: const Color(0xFF111827))),
              Text('Target: ${_formatDate(goal.targetDate)}', style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280), fontStyle: FontStyle.italic)),
            ]),
          ]),
          Text('${goal.progressPercentage.toInt()}%', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF2563EB))),
        ]),
        const SizedBox(height: 12),
        ClipRRect(borderRadius: BorderRadius.circular(5), child: LinearProgressIndicator(value: goal.progressPercentage / 100, minHeight: 10, backgroundColor: const Color(0xFFF3F4F6), valueColor: AlwaysStoppedAnimation<Color>(_getColor()))),
        const SizedBox(height: 12),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Saved: \$${goal.savedAmount.toStringAsFixed(0)}', style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF6B7280))),
          Text('Goal: \$${goal.targetAmount.toStringAsFixed(0)}', style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF6B7280))),
        ]),
      ]),
    );
  }
}