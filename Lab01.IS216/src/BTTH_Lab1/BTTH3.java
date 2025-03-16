package BTTH_Lab1;


import java.util.Scanner;

public class BTTH3{
    public static class Fraction {
        private int numerator;
        private int denominator;

        public Fraction(int numerator, int denominator) {
            if (denominator == 0) {
                throw new IllegalArgumentException("Mẫu số không thể bằng 0.");
            }
            this.numerator = numerator;
            this.denominator = denominator;
            simplify();
        }

        private void simplify() {
            int gcd = GCD(numerator, denominator);
            numerator /= gcd;
            denominator /= gcd;
        }

        public static int GCD(int a, int b) {
            while (b != 0) {
                int temp = b;
                b = a % b;
                a = temp;
            }
            return Math.abs(a);
        }

        public Fraction add(Fraction other) {
            return new Fraction(numerator * other.denominator + denominator * other.numerator, denominator * other.denominator);
        }

        public Fraction subtract(Fraction other) {
            return new Fraction(numerator * other.denominator - denominator * other.numerator, denominator * other.denominator);
        }

        public Fraction multiply(Fraction other) {
            return new Fraction(numerator * other.numerator, denominator * other.denominator);
        }

        public Fraction divide(Fraction other) {
            return new Fraction(numerator * other.denominator, denominator * other.numerator);
        }

        @Override
        public String toString() {
            return numerator + "/" + denominator;
        }

        public static void Calc() {
            Scanner scanner = new Scanner(System.in);
            System.out.print("Nhập tử và mẫu số của phân số 1: ");
            int a = scanner.nextInt(), b = scanner.nextInt();
            System.out.print("Nhập tử và mẫu số của phân số 2: ");
            int c = scanner.nextInt(), d = scanner.nextInt();

            Fraction frac1 = new Fraction(a, b);
            Fraction frac2 = new Fraction(c, d);

            System.out.println("Tổng: " + frac1.add(frac2));
            System.out.println("Hiệu: " + frac1.subtract(frac2));
            System.out.println("Tích: " + frac1.multiply(frac2));
            System.out.println("Thương: " + frac1.divide(frac2));
        }
    }
}