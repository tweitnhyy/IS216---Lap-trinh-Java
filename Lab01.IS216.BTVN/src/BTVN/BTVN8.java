package BTVN;

import java.io.*;

public class BTVN8 {
    public static void Calc() {
        String file1 = "src/BTVN/input8.1.txt";
        String file2 = "src/BTVN/input8.2.txt";

        try (BufferedReader br1 = new BufferedReader(new FileReader(file1));
             BufferedReader br2 = new BufferedReader(new FileReader(file2))) {

            String line1, line2;
            int lineNum = 1;

            while ((line1 = br1.readLine()) != null | (line2 = br2.readLine()) != null) {
                if (line1 == null) line1 = "";
                if (line2 == null) line2 = "";

                if (!line1.equals(line2)) {
                    System.out.println(lineNum + "// " + line1);
                    System.out.println(lineNum + "\\\\ " + line2);
                }

                lineNum++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
