package BTVN;

import java.io.*;

public class BTVN9 {
    public static void Calc() {
        String fileName = "src/BTVN/input9.txt";

        try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (isPalindrome(line)) {
                    System.out.println("\"" + line + "\" là palindrome.");
                } else {
                    System.out.println("\"" + line + "\" không phải là palindrome.");
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static boolean isPalindrome(String str) {
        str = str.replaceAll("[^a-zA-Z]", "").toLowerCase(); // Bỏ ký tự đặc biệt, chỉ giữ chữ cái
        return new StringBuilder(str).reverse().toString().equals(str);
    }
}