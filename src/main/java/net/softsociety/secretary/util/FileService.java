package net.softsociety.secretary.util;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;


/**
 * 파일 관련 유틸
 * 업로드한 파일의 저장 & 서버에 저장된 파일 삭제 등의 기능
 */
public class FileService {

	/**
	 * 업로드 된 파일을 지정된 경로에 저장하고, 저장된 파일명을 리턴
	 * @param mfile 업로드된 파일
	 * @param path 저장할 경로
	 * @return 저장된 파일명
	 */
	public static String saveFile(MultipartFile mfile, String uploadPath) {
		
		//업로드된 파일이 없거나 크기가 0이면 저장하지 않고 null을 리턴
		if (mfile == null || mfile.isEmpty() || mfile.getSize() == 0) {
			return null;
		}
		//저장 폴더가 없으면 생성
		File path = new File(uploadPath);
		if (!path.isDirectory()) {
			path.mkdirs();
		}
		//원본 파일명
		String originalFilename = mfile.getOriginalFilename();
		
		//원본 파일의 확장자
		int lastIndex = originalFilename.lastIndexOf('.');
		String ext = lastIndex == -1 ? "" : originalFilename.substring(lastIndex);

		//저장할 파일명을 오늘 날짜의 년월일로 생성
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String savedFilename = sdf.format(new Date());
		
		//저장할 전체 경로와 파일명을 포함한 File 객체
		File serverFile = null;
		
		//같은 이름의 파일이 있는 경우의 처리
		while (true) {
			serverFile = new File(uploadPath + "/" + savedFilename + ext);
			//같은 이름의 파일이 없으면 반복 종료.
			if ( !serverFile.isFile()) break;	
			//같은 이름의 파일이 있으면 이름 뒤에 long 타입의 시간정보를 덧붙임.
			savedFilename += new Date().getTime();
		}
		
		//파일 저장
		try {
			mfile.transferTo(serverFile);
		} catch (Exception e) {
			savedFilename = null;
			e.printStackTrace();
		}
		
		//누끼따기
        try {
            // Python executable command and script path
            String pythonCommand = "python"; // or "python3" depending on your setup
            String pythonScriptPath = "C:/Visual_Studio_Code/pythonWorkspace/changeImg.py";

            // Additional arguments to pass to the Python script
            String url = uploadPath+ "/" +savedFilename + ext; // Replace with your URL
            String result = savedFilename + "1.PNG"; // Replace with your result path
            
            // Create the ProcessBuilder
            ProcessBuilder processBuilder = new ProcessBuilder(pythonCommand, pythonScriptPath, url, result);

            // Redirect the error stream to the output stream
            processBuilder.redirectErrorStream(true);

            // Start the process
            Process process = processBuilder.start();

            // Wait for the process to finish
            int exitCode = process.waitFor();
            System.out.println("Python script exited with code: " + exitCode);

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }		
		
		
		//저장된 파일명 리턴
		return savedFilename + ext;
	}
	
	/**
	 * 서버에 저장된 파일의 전체 경로를 전달받아, 해당 파일을 삭제
	 * @param fullpath 삭제할 파일의 경로
	 * @return 삭제 여부
	 */
	public static boolean deleteFile(String fullPath) {
		//전달된 전체 경로로 File객체 생성
		File delFile = new File(fullPath);
		
		//해당 파일이 존재하면 삭제하고 true 리턴
		if (delFile.isFile()) {
			delFile.delete();
			return true;
		}
		return false;
	}
}
