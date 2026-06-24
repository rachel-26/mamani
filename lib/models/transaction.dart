class Transaction {
  final String id;
  final String title;
  final String category;
  final double amount;
  final DateTime date;
  final bool isExpense;
  final String? notes;

  Transaction({
    required this.id,
    required this.title,
    required this.category,
    required this.amount,
    required this.date,
    required this.isExpense,
    this.notes,
  });
}

class Goal {
  final String id;
  final String title;
  final double targetAmount;
  final double savedAmount;
  final DateTime targetDate;
  final bool isShortTerm;
  final int colorIndex;

  Goal({
    required this.id,
    required this.title,
    required this.targetAmount,
    required this.savedAmount,
    required this.targetDate,
    required this.isShortTerm,
    required this.colorIndex,
  });

  double get progressPercentage => (savedAmount / targetAmount) * 100;
}