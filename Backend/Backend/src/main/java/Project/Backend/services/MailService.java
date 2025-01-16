package Project.Backend.services;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailService {

    private static final Logger logger = Logger.getLogger(MailService.class.getName());
    private final JavaMailSender javaMailSender;
    private static final String senderEmail = "3179954@gmail.com";
    private final Map<String, Integer> emailVerificationMap = new ConcurrentHashMap<>();

    @Async
    public void sendMail(String mail) {
        int number = createNumber();
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mail);
            message.setSubject("TalkVillage에서 보낸 인증 번호입니다. : " + number);
            message.setText(buildEmailBody(number), "UTF-8", "html");

            javaMailSender.send(message);
            emailVerificationMap.put(mail, number);
            logger.info("인증번호 " + number + "가 " + mail + " 이메일로 전송되었습니다.");
            System.out.println("인증번호 " + number + "가 " + mail + " 이메일로 전송되었습니다.");

        } catch (MessagingException e) {
            e.printStackTrace();  // 콘솔에 예외 세부 정보를 출력
            throw new RuntimeException("메일 전송에 실패했습니다.", e);
        }
    }

    public int getVerificationNumber(String mail) {
        return emailVerificationMap.getOrDefault(mail, -1);
    }

    private int createNumber() {
        return (int) (Math.random() * 900000) + 100000; // 범위 100000 ~ 999999
    }

    public boolean checkVerificationNumber(String mail, int userNumber) {
        Integer storedNumber = getVerificationNumber(mail);
        return storedNumber != null && storedNumber == userNumber;
    }

    private String buildEmailBody(int number) {
        return "<!DOCTYPE html>"
             + "<html lang='ko'>"
             + "<head>"
             + "    <meta charset='UTF-8'>"
             + "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
             + "    <style>"
             + "        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #121212; color: #f0f0f0; }" // 기본 글씨색을 밝게
             + "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1c1c1c; border-radius: 8px; text-align: center; }"
             + "        .header { font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #ff4d4f; }"
             + "        .content { font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #f0f0f0; }" // content 색상을 더 밝게
             + "        .code { font-size: 48px; font-weight: bold; color: #ffffff; letter-spacing: 5px; background-color: #333; padding: 20px; border-radius: 8px; margin: 20px 0; }"
             + "        .footer { font-size: 12px; color: #cccccc; margin-top: 30px; }" // 푸터 텍스트 색상도 좀 더 밝게
             + "        .footer a { color: #cccccc; text-decoration: underline; }"
             + "    </style>"
             + "</head>"
             + "<body>"
             + "    <div class='container'>"
             + "        <div class='header'>"
             + "            이메일 인증"
             + "        </div>"
             + "        <div class='content'>"
             + "            <p>회원님의 계정에 등록된 이메일 주소 확인을 위한 인증번호입니다.<br>"
             + "            아래 인증번호를 복사하여 인증을 완료해 주세요.</p>"
             + "            <div class='code'>" + number + "</div>"
             + "            <p>개인정보 보호를 위해 인증번호는 <b>10분</b> 동안만 유효합니다.</p>"
             + "        </div>"
             + "        <div class='footer'>"
             + "            발신 전용 이메일입니다. 궁금한 사항은 <a href='https://your-company-support.com'>고객지원</a>을 이용해 주세요."
             + "        </div>"
             + "    </div>"
             + "</body>"
             + "</html>";
    }

}
