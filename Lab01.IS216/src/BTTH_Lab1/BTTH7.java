package BTTH_Lab1;

import java.util.Scanner;

public class BTTH7 {
    public static boolean kiemTraSoNguyenTo(int n) {
        if (n < 2) return false;

        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void Calc() {
        Scanner in = new Scanner(System.in);
        System.out.print("Nhap so nguyen duong: ");
        int n = in.nextInt();

        if (kiemTraSoNguyenTo(n)) System.out.println(n + " la so nguyen to");
        else System.out.println(n + " khong la so nguyen to");
    }
}
