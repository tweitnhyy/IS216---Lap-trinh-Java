package BTTH_Lab1;

import java.util.Scanner;
import java.util.Arrays;

public class BTTH9 {
    public static void Calc() {
        int n;
        Scanner scanln = new Scanner(System.in);
        System.out.print("Nhập số phần tử trong mảng: ");
        n = scanln.nextInt();

        int[] arr = new int[n];
        System.out.print("Nhập các phần tử trong mảng: ");
        for (int i = 0; i < n; i++) {
            arr[i] = scanln.nextInt();
        }

        // Xuất kết quả
        System.out.print("Mảng vừa nhập được là: ");
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i]);
            if (i < n - 1) {
                System.out.print(", ");
            }
        }

        //Sắp xếp mảng tăng tìm giá trị lớn nhất và nhỏ nhất
        System.out.println();
        Arrays.sort(arr);
        System.out.println("Giá trị nhỏ nhất và lớn nhất lần lượt là: " + arr[0] + ", " + arr[n-1]);
        System.out.print("Mảng sau khi sắp xếp tăng dần là: ");
        for (int i = 0; i < n; i++) {
            System.out.print(arr[i]);
            if (i < n - 1) {
                System.out.print(", ");
            }
        }

        // Tìm giá trị của x trong mảng
        System.out.println();
        System.out.print("Nhập x: ");
        int x = scanln.nextInt();
        int pos = Arrays.binarySearch(arr, x) + 1;
        if (pos < 0 || pos > n) {
            System.out.println("Không có trong phần tử");
        } else {
            System.out.println("Giá trị x nằm ở vị trí thứ " + pos + " trong mảng");
        }
    }
}
