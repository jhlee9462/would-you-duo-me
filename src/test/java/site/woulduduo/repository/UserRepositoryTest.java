package site.woulduduo.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;
import site.woulduduo.entity.Accuse;
import site.woulduduo.entity.User;
import site.woulduduo.enumeration.Gender;
import site.woulduduo.enumeration.Tier;

import java.time.LocalDate;
import java.util.List;
@SpringBootTest
@Transactional
@Rollback(value = false)
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;
    @Autowired
    AccuseRepository accuseRepository;

    @Test
    @DisplayName("사용자 저장")
    void saveTest() {
        User user2 = User.builder()
                .userAccount("123")
                .userNickname("123")
                .userPassword("123")
                .userCurrentPoint(123)
                .userBirthday(LocalDate.of(1999, 11, 07))
                .lolNickname("123")
                .userGender(Gender.F)
                .lolTier(Tier.DIA)
//                .accuseList(Accuse)
                .build();
        User user3 = User.builder()
                .userAccount("234")
                .userNickname("234")
                .userPassword("234")
                .userCurrentPoint(234)
                .userBirthday(LocalDate.of(1999, 11, 07))
                .lolNickname("234")
                .userGender(Gender.F)
                .lolTier(Tier.DIA)
//                .accuseList(Accuse)
                .build();
        User user4 = User.builder()
                .userAccount("345")
                .userNickname("345")
                .userPassword("345")
                .userCurrentPoint(345)
                .userBirthday(LocalDate.of(1999, 11, 07))
                .lolNickname("345")
                .userGender(Gender.F)
                .lolTier(Tier.DIA)
//                .accuseList(Accuse)
                .build();
        User save = userRepository.save(user2);
        User save1 = userRepository.save(user3);
        User save2 = userRepository.save(user4);


        Accuse accuse = Accuse.builder()
                .user(save)
                .accuseType("경고")
                .build();
        Accuse accuse1 = Accuse.builder()
                .user(save1)
                .accuseType("경고")
                .build();
        Accuse accuse2 = Accuse.builder()
                .user(save2)
                .accuseType("경고")
                .build();

        Accuse asave = accuseRepository.save(accuse);
        Accuse asave1 = accuseRepository.save(accuse1);
        Accuse asave2 = accuseRepository.save(accuse2);

    }


    @BeforeEach
    void bulkInsert() {
        // 학생을 147명 저장
        for (int i = 1; i <= 147; i++) {
            User User1 = User.builder()
                    .userAccount("acvd" + i)
                    .userNickname("asd" + i)
                    .userPassword("12345")
                    .userCurrentPoint(123)
                    .userBirthday(LocalDate.of(1990, 11, 07))
                    .lolNickname("asd" + i)
                    .userGender(Gender.F)
                    .lolTier(Tier.DIA)
                    .build();
            userRepository.save(User1);
        }
    }

    @Test
    @DisplayName("전제 조회")
    void findAll() {
        List<User> all = userRepository.findAll();
        System.out.println("all = " + all);
    }

    @Test
    @DisplayName("페이징처리")
    void searchTest() {

        int page = 1;
        String keyword = "";
        int size = 10;

        Pageable pageInfo
                = PageRequest.of(page - 1,
                size,
                //Sort.by("name").descending() // 정렬기준 필드명
                Sort.by(
                        Sort.Order.desc("userJoinDate")
                )
        );

        Page<User> users = userRepository.findAll(pageInfo);
        List<User> userList = users.getContent();

        int totalPages = users.getTotalPages();
        long totalElements = users.getTotalElements();

        Pageable prev = users.getPageable().previousOrFirst();
        Pageable next = users.getPageable().next();

        //then
        System.out.println("\n\n\n");
        System.out.println("totalPages = " + totalPages);
        System.out.println("totalElements = " + totalElements);
        System.out.println("prev = " + prev);
        System.out.println("next = " + next);
        System.out.println("\n\n\n");
        userList.forEach(System.out::println);
        System.out.println("\n\n\n");
    }


    @Test
    @DisplayName("전체회원수 확인")
    void countTest() {

        List<User> all = userRepository.findAll();
        int size = all.size();
        System.out.println("size = " + size);
    }

    @Test
    @DisplayName("금일 가입자 count 확인")
    void todaySaveTest() {
        User user2 = User.builder()
                .userAccount("123")
                .userNickname("123")
                .userPassword("123")
                .userCurrentPoint(123)
                .userBirthday(LocalDate.of(1999, 11, 07))
                .lolNickname("123")
                .userGender(Gender.F)
                .lolTier(Tier.DIA)
//                .accuseList(Accuse)
                .build();

        User save = userRepository.save(user2);
        List<User> all = userRepository.findAll();
        System.out.println("all = " + all);

        int allWithSQL = userRepository.findAllWithJoinDate(LocalDate.of(2023, 06, 18));
        System.out.println("allWithSQL = " + allWithSQL);

        LocalDate userJoinDate = save.getUserJoinDate();
        System.out.println("userJoinDate = " + userJoinDate);
    }

    @Test
    @DisplayName("findById test")
    void findByIdTest() {
        User user1 = userRepository.findById("user1").orElseThrow();

        System.out.println("user1 = " + user1);
    }

}