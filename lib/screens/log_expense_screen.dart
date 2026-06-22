import 'package:flutter/material.dart';

class LogExpenseScreen extends StatefulWidget {
  const LogExpenseScreen({super.key});

  @override
  State<LogExpenseScreen> createState() => _LogExpenseScreenState();
}

class _LogExpenseScreenState extends State<LogExpenseScreen> {
  final TextEditingController _amountCtrl = TextEditingController(text: '0.00');
  DateTime _date = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Quick Log'), backgroundColor: Colors.transparent, foregroundColor: Theme.of(context).colorScheme.primary, elevation: 0),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Natural Input', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 8),
            Card(child: Padding(padding: const EdgeInsets.all(8.0), child: Row(children: const [Icon(Icons.auto_awesome, color: Colors.green), SizedBox(width: 8), Expanded(child: TextField(decoration: InputDecoration(border: InputBorder.none, hintText: "Type 'Lunch with team $45'...")))]))),
            const SizedBox(height: 12),
            Card(child: Padding(padding: const EdgeInsets.all(12.0), child: Column(children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Amount'), Row(children: [const Text('\$'), SizedBox(width: 8, child: TextField(controller: TextEditingController(text: '0.00'), keyboardType: TextInputType.number, decoration: const InputDecoration(border: InputBorder.none))])]),
              const SizedBox(height: 12),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Date'), TextButton(onPressed: () async { final d = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime(2000), lastDate: DateTime(2100)); if (d != null) setState(() => _date = d); }, child: Text('${DateTime.now().toLocal().toIso8601String().split('T').first}'))]),
              const SizedBox(height: 12),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [const Text('Account'), Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), decoration: BoxDecoration(borderRadius: BorderRadius.circular(8), color: Colors.grey.shade100), child: const Text('PERSONAL VAULT'))]),
            ]))),
            const SizedBox(height: 12),
            Card(child: Padding(padding: const EdgeInsets.all(12.0), child: Column(children: [
              const Text('Habit Alert', style: TextStyle(color: Colors.green, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              const Text('You usually spend \$12.50 more on Fridays in this category.'),
              const SizedBox(height: 8),
              Align(alignment: Alignment.centerRight, child: TextButton(onPressed: () {}, child: const Text('Adjust Budget')))
            ]))),
            const Spacer(),
            SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () {}, child: const Padding(padding: EdgeInsets.symmetric(vertical: 16.0), child: Text('Log Expense'))))
          ]),
        ),
      ),
    );
  }
}
