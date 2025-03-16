package BTVN;

import java.util.Scanner;

public class BTVN4 {
    public static void Calc() {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nhap so tu nhien n: ");
        int n = sc.nextInt();

        if (n <= 0) {
            System.out.println("Vui long nhap so tu nhien.");
        } else {
            int sum = 0;

            for (int i = 1; i <= n / 2; i++) {
                if (n % i == 0) {
                    sum += i;
                }
            }

            if (sum == n) {
                System.out.println(n + " la so hoan hao.");
            } else {
                System.out.println(n + " khong la so hoan hao.");
            }
        }


    }
}