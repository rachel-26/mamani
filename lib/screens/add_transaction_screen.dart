_import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/transaction.dart';

class AddTransactionScreen extends StatefulWidget {
  const AddTransactionScreen({super.key});

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  bool _isExpense = true;
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();
  String _selectedCategory = 'Food';
  DateTime _selectedDate = DateTime.now();

  final List<Map<String, dynamic>> _categories = [
    {'name': 'Food', 'icon': Icons.shopping_cart_outlined, 'bgColor': const Color(0xFFFFEDD5), 'iconColor': const Color(0xFFEA580C)},
    {'name': 'Transport', 'icon': Icons.directions_car_outlined, 'bgColor': const Color(0xFFDBEAFE), 'iconColor': const Color(0xFF2563EB)},
    {'name': 'Rent', 'icon': Icons.home_outlined, 'bgColor': const Color(0xFFF3E8FF), 'iconColor': const Color(0xFF7C3AED)},
    {'name': 'More', 'icon': Icons.add, 'bgColor': const Color(0xFFF1F5F9), 'iconColor': const Color(0xFF94A3B8), 'isAddMore': true},
  ];

  @override
  void dispose() {
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _saveTransaction() {
    final transaction = Transaction(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: _selectedCategory,
      category: _selectedCategory,
      amount: double.tryParse(_amountController.text) ?? 0.0,
      date: _selectedDate,
      isExpense: _isExpense,
      notes: _notesController.text.isEmpty ? null : _notesController.text,
    );
    Navigator.pop(context, transaction);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(children: [
                    const SizedBox(height: 32),
                    _buildAmountSection(),
                    const SizedBox(height: 32),
                    _buildTypeToggle(),
                    const SizedBox(height: 32),
                    _buildCategorySelector(),
                    const SizedBox(height: 24),
                    _buildDatePicker(),
                    const SizedBox(height: 24),
                    _buildNotesField(),
                    const SizedBox(height: 24),
                  ]),
                ),
              ),
            ),
            _buildSaveButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF94A3B8), size: 24), padding: const EdgeInsets.all(8)),
        Text('Add Transaction', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w600, color: const Color(0xFF1E293B))),
        const SizedBox(width: 48),
      ]),
    );
  }

  Widget _buildAmountSection() {
    return Column(children: [
      Text('AMOUNT', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFF64748B), letterSpacing: 1.5)),
      const SizedBox(height: 16),
      Center(child: Row(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.center, children: [
        Padding(padding: const EdgeInsets.only(bottom: 8), child: Text('\$', style: GoogleFonts.inter(fontSize: 36, fontWeight: FontWeight.w300, color: const Color(0xFF94A3B8)))),
        const SizedBox(width: 4),
        SizedBox(width: 200, child: TextField(
          controller: _amountController,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(fontSize: 60, fontWeight: FontWeight.w700, color: _isExpense ? const Color(0xFF1E293B) : const Color(0xFF059669)),
          decoration: const InputDecoration(hintText: '0.00', hintStyle: TextStyle(color: Color(0xFFE2E8F0), fontSize: 60, fontWeight: FontWeight.w700), border: InputBorder.none),
          inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}'))],
        )),
      ])),
    ]);
  }

  Widget _buildTypeToggle() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(16)),
      child: Row(children: [
        Expanded(child: GestureDetector(
          onTap: () => setState(() => _isExpense = true),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(color: _isExpense ? Colors.white : Colors.transparent, borderRadius: BorderRadius.circular(12),
              boxShadow: _isExpense ? [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 6, offset: const Offset(0, 4))] : []),
            child: Center(child: Text('Expense', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: _isExpense ? const Color(0xFF1E293B) : const Color(0xFF64748B)))),
          ),
        )),
        Expanded(child: GestureDetector(
          onTap: () => setState(() => _isExpense = false),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(color: !_isExpense ? Colors.white : Colors.transparent, borderRadius: BorderRadius.circular(12),
              boxShadow: !_isExpense ? [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 6, offset: const Offset(0, 4))] : []),
            child: Center(child: Text('Income', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: !_isExpense ? const Color(0xFF1E293B) : const Color(0xFF64748B)))),
          ),
        )),
      ]),
    );
  }

  Widget _buildCategorySelector() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Category', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFF64748B))),
      const SizedBox(height: 12),
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: _categories.map((category) {
        final isSelected = _selectedCategory == category['name'];
        final isAddMore = category['isAddMore'] == true;
        return GestureDetector(
          onTap: () => setState(() => _selectedCategory = category['name']),
          child: Column(children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 56, height: 56,
              decoration: BoxDecoration(
                color: isSelected && !isAddMore ? category['iconColor'].withOpacity(0.2) : category['bgColor'],
                borderRadius: BorderRadius.circular(16),
                border: isAddMore ? Border.all(color: const Color(0xFFE2E8F0), width: 2) : null,
              ),
              child: Icon(category['icon'], color: category['iconColor'], size: 24),
            ),
            const SizedBox(height: 8),
            Text(category['name'], style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: isAddMore ? const Color(0xFF94A3B8) : const Color(0xFF475569))),
          ]),
        );
      }).toList()),
    ]);
  }

  Widget _buildDatePicker() {
    return GestureDetector(
      onTap: () async {
        final date = await showDatePicker(context: context, initialDate: _selectedDate, firstDate: DateTime(2000), lastDate: DateTime(2100));
        if (date != null) setState(() => _selectedDate = date);
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(16)),
        child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Row(children: [
            Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 1))]),
              child: const Icon(Icons.calendar_today, color: Color(0xFF6366F1), size: 20)),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Date', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: const Color(0xFF94A3B8))),
              const SizedBox(height: 2),
              Text(_formatDate(_selectedDate), style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF334155))),
            ]),
          ]),
          Text('Change', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: const Color(0xFF6366F1))),
        ]),
      ),
    );
  }

  Widget _buildNotesField() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Notes (Optional)', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFF64748B))),
      const SizedBox(height: 8),
      TextField(
        controller: _notesController,
        maxLines: 3,
        style: GoogleFonts.inter(fontSize: 14),
        decoration: InputDecoration(
          hintText: 'What was this for?...',
          hintStyle: GoogleFonts.inter(color: const Color(0xFFCBD5E1)),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF6366F1))),
          filled: true, fillColor: Colors.white, contentPadding: const EdgeInsets.all(16),
        ),
      ),
    ]);
  }

  Widget _buildSaveButton() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
      child: SizedBox(width: double.infinity, child: ElevatedButton(
        onPressed: _saveTransaction,
        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F172A), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)), elevation: 0),
        child: Text('Save Transaction', style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700)),
      )),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    if (date.year == now.year && date.month == now.month && date.day == now.day) {
      return 'Today, ${_getFormattedDate(date)}';
    }
    return _getFormattedDate(date);
  }

  String _getFormattedDate(DateTime date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }
}