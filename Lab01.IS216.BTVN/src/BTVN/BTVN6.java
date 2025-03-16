package BTVN;

import java.util.Arrays;
import java.util.Scanner;

public class BTVN6
{
    public static void Calc()
    {
        Scanner in = new Scanner(System.in);

        System.out.print("Nhập số dòng n: ");
        int n = in.nextInt();
        System.out.print("Nhập số cột m: ");
        int m = in.nextInt();

        int[][] A = new int[n][m];

        System.out.println("Nhập các phần tử của mảng A:");
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < m; j++)
            {
                do
                {
                    System.out.print("A[" + i + "][" + j + "]: ");
                    A[i][j] = in.nextInt();
                } while (A[i][j] < 1 || A[i][j] > 99);
            }
        }

        int maxVal = A[0][0];
        int maxRow = 0, maxCol = 0;
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < m; j++)
            {
                if (A[i][j] > maxVal)
                {
                    maxVal = A[i][j];
                    maxRow = i;
                    maxCol = j;
                }
            }
        }
        System.out.println("Phần tử lớn nhất: " + maxVal + " tại vị trí A[" + maxRow + "][" + maxCol + "]");

        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < m; j++)
            {
                if (!isPrime(A[i][j]))
                {
                    A[i][j] = 0;
                }
            }
        }
        System.out.println("Mảng A sau khi thay thế số không nguyên tố bằng 0:");
        printMatrix(A);

        sortColumns(A);
        System.out.println("Mảng A sau khi sắp xếp các cột theo thứ tự tăng dần:");
        printMatrix(A);

        in.close();
    }

    public static boolean isPrime(int num)
    {
        if (num < 2) return false;
        for (int i = 2; i <= Math.sqrt(num); i++)
        {
            if (num % i == 0) return false;
        }
        return true;
    }

    public static void printMatrix(int[][] matrix)
    {
        for (int[] row : matrix)
        {
            System.out.println(Arrays.toString(row));
        }
    }

    public static void sortColumns(int[][] matrix)
    {
        int n = matrix.length, m = matrix[0].length;
        for (int j = 0; j < m; j++)
        {
            int[] column = new int[n];
            for (int i = 0; i < n; i++)
            {
                column[i] = matrix[i][j];
            }
            Arrays.sort(column);
            for (int i = 0; i < n; i++)
            {
                matrix[i][j] = column[i];
            }
        }
    }
}
