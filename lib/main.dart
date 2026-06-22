import 'package:flutter/material.dart';
import 'screens/dashboard_screen.dart';
import 'screens/analysis_screen.dart';
import 'screens/log_expense_screen.dart';

void main() {
  runApp(const MamaniApp());
}

class MamaniApp extends StatelessWidget {
  const MamaniApp({super.key});

  @override
  Widget build(BuildContext context) {
    final primary = const Color(0xFF006C47);
    final surface = const Color(0xFFF7FAFE);

    return MaterialApp(
      title: 'Mamani',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: primary, background: surface),
        scaffoldBackgroundColor: surface,
        fontFamily: 'Hanken Grotesk',
      ),
      initialRoute: '/',
      routes: {
        '/': (ctx) => const DashboardScreen(),
        '/analysis': (ctx) => const AnalysisScreen(),
        '/log': (ctx) => const LogExpenseScreen(),
      },
    );
  }
}
