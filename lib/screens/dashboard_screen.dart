import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/transaction.dart';
import '../widgets/bottom_nav_bar.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedNavIndex = 0;

  // Using Transaction model for sample data
  final List<Transaction> _recentTransactions = [
    Transaction(
      id: '1',
      title: 'Whole Foods',
      category: 'Food & Groceries',
      amount: 84.20,
      date: DateTime.now(),
      isExpense: true,
    ),
    Transaction(
      id: '2',
      title: 'Upwork Payout',
      category: 'Freelance Income',
      amount: 450.00,
      date: DateTime.now().subtract(const Duration(days: 1)),
      isExpense: false,
    ),
    Transaction(
      id: '3',
      title: 'Netflix',
      category: 'Entertainment',
      amount: 15.99,
      date: DateTime(2023, 8, 14),
      isExpense: true,
    ),
    Transaction(
      id: '4',
      title: 'Rent Payment',
      category: 'Housing',
      amount: 1200.00,
      date: DateTime(2023, 8, 1),
      isExpense: true,
    ),
  ];

  // Sample goal using Goal model
  final Goal _primaryGoal = Goal(
    id: '1',
    title: 'Japan Trip 2024',
    targetAmount: 5000.00,
    savedAmount: 3250.00,
    targetDate: DateTime(2024, 12, 30),
    isShortTerm: false,
    colorIndex: 0,
  );

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'Food & Groceries':
        return const Color(0xFFFFEDD5);
      case 'Freelance Income':
        return const Color(0xFFDBEAFE);
      case 'Entertainment':
        return const Color(0xFFEDE9FE);
      case 'Housing':
        return const Color(0xFFF3F4F6);
      default:
        return const Color(0xFFF1F5F9);
    }
  }

  Color _getCategoryIconColor(String category) {
    switch (category) {
      case 'Food & Groceries':
        return const Color(0xFFEA580C);
      case 'Freelance Income':
        return const Color(0xFF2563EB);
      case 'Entertainment':
        return const Color(0xFF7C3AED);
      case 'Housing':
        return const Color(0xFF4B5563);
      default:
        return const Color(0xFF64748B);
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Food & Groceries':
        return Icons.shopping_cart_outlined;
      case 'Freelance Income':
        return Icons.swap_horiz;
      case 'Entertainment':
        return Icons.phone_android;
      case 'Housing':
        return Icons.home_outlined;
      default:
        return Icons.receipt_long;
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    if (date.year == now.year && date.month == now.month && date.day == now.day) {
      return 'Today';
    } else if (date.year == now.year && date.month == now.month && date.day == now.day - 1) {
      return 'Yesterday';
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return '${months[date.month - 1]} ${date.day}';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                _buildTopBar(),
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Column(
                      children: [
                        _buildBalanceCard(),
                        const SizedBox(height: 24),
                        _buildSavingSuggestion(),
                        const SizedBox(height: 32),
                        _buildPrimaryGoal(),
                        const SizedBox(height: 32),
                        _buildRecentTransactions(),
                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            Positioned(
              bottom: 100,
              right: 24,
              child: _buildFAB(),
            ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: BottomNavBar(
                selectedIndex: _selectedNavIndex,
                onTap: (index) {
                  setState(() => _selectedNavIndex = index);
                  _navigateToScreen(index);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 40, 24, 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Welcome back,',
                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: const Color(0xFF94A3B8), letterSpacing: 0.5)),
              const SizedBox(height: 2),
              Text('Alex Johnson',
                style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
            ],
          ),
          Stack(
            children: [
              IconButton(onPressed: () {}, icon: const Icon(Icons.notifications_outlined, color: Color(0xFF64748B), size: 24)),
              Positioned(
                top: 8, right: 8,
                child: Container(
                  width: 8, height: 8,
                  decoration: BoxDecoration(color: Colors.red, borderRadius: BorderRadius.circular(4),
                    boxShadow: [BoxShadow(color: Colors.red.withOpacity(0.5), blurRadius: 4, spreadRadius: 1)]),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBalanceCard() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF1E3A8A), Color(0xFF1E40AF)]),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 4)),
            BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text("Today's Balance", style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.white.withOpacity(0.8), letterSpacing: 1.5)),
              Icon(Icons.info_outline, color: Colors.white.withOpacity(0.7), size: 20),
            ]),
            const SizedBox(height: 8),
            Text('\$1,245.50', style: GoogleFonts.inter(fontSize: 36, fontWeight: FontWeight.w700, color: Colors.white)),
            const SizedBox(height: 24),
            Row(children: [
              Expanded(child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Container(padding: const EdgeInsets.all(6), decoration: BoxDecoration(color: const Color(0xFF4ADE80), borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.arrow_upward, color: Colors.white, size: 12)),
                    const SizedBox(width: 8),
                    Text('Income', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white.withOpacity(0.7), letterSpacing: 0.5)),
                  ]),
                  const SizedBox(height: 4),
                  Text('\$2,800.00', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white)),
                ]),
              )),
              const SizedBox(width: 16),
              Expanded(child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Container(padding: const EdgeInsets.all(6), decoration: BoxDecoration(color: const Color(0xFFF87171), borderRadius: BorderRadius.circular(8)),
                      child: const Icon(Icons.arrow_downward, color: Colors.white, size: 12)),
                    const SizedBox(width: 8),
                    Text('Expenses', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white.withOpacity(0.7), letterSpacing: 0.5)),
                  ]),
                  const SizedBox(height: 4),
                  Text('\$1,554.50', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFFFEE2E2))),
                ]),
              )),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildSavingSuggestion() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: const Color(0xFFECFDF5), border: Border.all(color: const Color(0xFFA7F3D0)), borderRadius: BorderRadius.circular(16)),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(12)),
            child: const Icon(Icons.bolt, color: Colors.white, size: 24)),
          const SizedBox(width: 16),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Saving Suggestion', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF064E3B))),
            const SizedBox(height: 4),
            Text("You've spent 15% more on Food this week. Reducing coffee runs could save you \$40/month towards your Vacation goal!",
              style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF047857), height: 1.5)),
          ])),
        ]),
      ),
    );
  }

  Widget _buildPrimaryGoal() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Primary Goal', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
          TextButton(onPressed: () {}, child: Text('See All', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF2563EB)))),
        ]),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFF1F5F9)),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 2))]),
          child: Column(children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Row(children: [
                Container(width: 40, height: 40, decoration: BoxDecoration(color: const Color(0xFFDBEAFE), borderRadius: BorderRadius.circular(20)),
                  child: const Icon(Icons.public, color: Color(0xFF2563EB), size: 24)),
                const SizedBox(width: 12),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(_primaryGoal.title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
                  Text('Target: Dec 30, 2024', style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF94A3B8))),
                ]),
              ]),
              Text('${_primaryGoal.progressPercentage.toInt()}%', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF2563EB))),
            ]),
            const SizedBox(height: 16),
            ClipRRect(borderRadius: BorderRadius.circular(6), child: LinearProgressIndicator(value: _primaryGoal.progressPercentage / 100, minHeight: 12, backgroundColor: const Color(0xFFF1F5F9), valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF2563EB)))),
            const SizedBox(height: 12),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('\$${_primaryGoal.savedAmount.toStringAsFixed(2)} saved', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: const Color(0xFF64748B))),
              Text('Goal: \$${_primaryGoal.targetAmount.toStringAsFixed(2)}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: const Color(0xFF64748B))),
            ]),
          ]),
        ),
      ]),
    );
  }

  Widget _buildRecentTransactions() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Recent Transactions', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
          TextButton(onPressed: () {}, child: Text('View All', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF2563EB)))),
        ]),
        const SizedBox(height: 12),
        ..._recentTransactions.map((t) => Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFFF8FAFC)),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 2))]),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Row(children: [
              Container(width: 48, height: 48, decoration: BoxDecoration(color: _getCategoryColor(t.category), borderRadius: BorderRadius.circular(16)),
                child: Icon(_getCategoryIcon(t.category), color: _getCategoryIconColor(t.category), size: 24)),
              const SizedBox(width: 16),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(t.title, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: const Color(0xFF1E293B))),
                const SizedBox(height: 2),
                Text('${t.category} • ${_formatDate(t.date)}', style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF94A3B8))),
              ]),
            ]),
            Text('${t.isExpense ? "-" : "+"}\$${t.amount.toStringAsFixed(2)}',
              style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: t.isExpense ? const Color(0xFFEF4444) : const Color(0xFF10B981))),
          ]),
        )),
      ]),
    );
  }

  Widget _buildFAB() {
    return Container(
      width: 64, height: 64,
      decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(32),
        boxShadow: [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.4), blurRadius: 15, offset: const Offset(0, 10))]),
      child: Material(color: Colors.transparent,
        child: InkWell(borderRadius: BorderRadius.circular(32),
          onTap: () => Navigator.pushNamed(context, '/add-transaction'),
          child: const Icon(Icons.add, color: Colors.white, size: 32))),
    );
  }

  void _navigateToScreen(int index) {
    switch (index) {
      case 0: Navigator.pushReplacementNamed(context, '/dashboard'); break;
      case 1: Navigator.pushReplacementNamed(context, '/insights'); break;
      case 3: Navigator.pushReplacementNamed(context, '/goals'); break;
    }
  }
}