package BTVN;

import java.util.Arrays;
import java.util.Random;
import java.util.Scanner;

public class BTVN5
{
    public static void Calc()
    {
        Scanner in = new Scanner(System.in);
        Random random = new Random();

        System.out.print("Nhập kích thước n của mảng A: ");
        int n = in.nextInt();
        int[] A = new int[n];

        System.out.println("Nhập các phần tử của mảng A:");
        for (int i = 0; i < n; i++)
        {
            System.out.print("A[" + i + "]: ");
            A[i] = in.nextInt();
        }

        System.out.print("Nhập kích thước m của mảng B: ");
        int m = in.nextInt();
        int[] B = new int[m];

        for (int i = 0; i < m; i++)
        {
            B[i] = random.nextInt(100);
        }

        System.out.println("Mảng B (ngẫu nhiên): " + Arrays.toString(B));

        int[] C = Arrays.copyOf(A, A.length);
        System.out.println("Mảng C (copy từ A): " + Arrays.toString(C));

        if (m < 3)
        {
            System.out.println("Mảng B có ít hơn 3 phần tử, không thể thay thế vào C.");
        }
        else if (C.length < 3)
        {
            System.out.println("Mảng C có ít hơn 3 phần tử, không thể thay thế.");
        }
        else
        {
            System.arraycopy(B, m - 3, C, 0, 3);
            System.out.println("Mảng C sau khi thay thế phần tử: " + Arrays.toString(C));
        }

        Arrays.sort(C);
        System.out.println("Mảng C sau khi sắp xếp tăng dần: " + Arrays.toString(C));

    }
}
