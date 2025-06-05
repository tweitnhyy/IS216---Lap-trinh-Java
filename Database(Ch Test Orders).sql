-- Tạo bảng USERS trước vì các bảng khác sẽ tham chiếu đến nó
CREATE TABLE USERS (
                       USER_ID VARCHAR2(50 BYTE) NOT NULL,
                       USERNAME VARCHAR2(50 BYTE) NOT NULL,
                       EMAIL VARCHAR2(100 BYTE) NOT NULL,
                       PASSWORD_HASH VARCHAR2(255 BYTE) NOT NULL,
                       ROLE VARCHAR2(20 BYTE) NOT NULL,
                       LAST_LOGIN TIMESTAMP(6),
                       FULL_NAME VARCHAR2(50 BYTE),
                       DOB TIMESTAMP(6),
                       PHONE_NUMBER VARCHAR2(20 BYTE),
                       GENDER VARCHAR2(7 BYTE),
                       RESET_TOKEN VARCHAR2(255 BYTE),
                       RESET_TOKEN_EXPIRY TIMESTAMP(6),
                       CONSTRAINT PK_USERS PRIMARY KEY (USER_ID)
);

-- Tạo bảng USER_SESSIONS, tham chiếu đến USERS
CREATE TABLE USERSESSIONS (
                              SESSION_ID VARCHAR2(50 BYTE) NOT NULL,
                              USER_ID VARCHAR2(50 BYTE) NOT NULL,
                              TOKEN VARCHAR2(255 BYTE) NOT NULL,
                              CREATED_AT TIMESTAMP(6) DEFAULT SYSTIMESTAMP,
                              CONSTRAINT PK_USER_SESSIONS PRIMARY KEY (SESSION_ID),
                              CONSTRAINT FK_USER_SESSIONS_USER_ID FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID)
);

-- Tạo bảng EVENTS, thêm cột USER_ID và DESCRIPTION
CREATE TABLE EVENTS (
                        EVENT_ID VARCHAR2(50 BYTE) NOT NULL,
                        TITLE VARCHAR2(255 BYTE) NOT NULL,
                        USER_ID VARCHAR2(50 BYTE) NOT NULL,
                        CITY VARCHAR2(100 BYTE) NOT NULL,
                        POSTER VARCHAR2(255 BYTE),
                        POSTER_SUB VARCHAR2(255 BYTE),
                        VIDEO VARCHAR2(255 BYTE),
                        DESCRIPTION CLOB, -- Thêm cột DESCRIPTION
                        START_DATE_TIME TIMESTAMP(6),
                        END_DATE_TIME TIMESTAMP(6),
                        LOCATION VARCHAR2(255 BYTE),
                        TICKET_SALE_START TIMESTAMP(6), -- Đổi KDL
                        TICKET_SALE_END TIMESTAMP(6), -- Đổi KDL
                        ORGANIZER_NAME VARCHAR2(100 BYTE),
                        ORGANIZER_LOGO VARCHAR2(255 BYTE),
                        CREATED_AT TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
                        UPDATED_AT TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
                        FORMAT VARCHAR2(20 BYTE),
                        ORGANIZER_DESCRIPTION CLOB,
                        CONSTRAINT PK_EVENTS PRIMARY KEY (EVENT_ID),
                        CONSTRAINT FK_EVENTS_USER_ID FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID)
);

-- Tạo bảng TICKETTYPES, tham chiếu đến EVENTS
CREATE TABLE TICKETTYPES (
                             TICKET_TYPE_ID VARCHAR2(50 BYTE) NOT NULL,
                             EVENT_ID VARCHAR2(50 BYTE) NOT NULL,
                             TYPE VARCHAR2(50 BYTE) NOT NULL,
                             PRICE NUMBER(15,2) NOT NULL,
                             QUANTITY NUMBER(10,0) NOT NULL,
                             CREATED_AT TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
                             UPDATED_AT TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
                             MAX_PER_ORDER NUMBER,
                             TICKET_SALE_START TIMESTAMP(6),
                             TICKET_SALE_END TIMESTAMP(6),
                             CONSTRAINT PK_TICKET_TYPES PRIMARY KEY (TICKET_TYPE_ID),
                             CONSTRAINT FK_TICKET_TYPES_EVENT_ID FOREIGN KEY (EVENT_ID) REFERENCES EVENTS(EVENT_ID)
);

-- Tạo bảng TICKETS, tham chiếu đến TICKET_TYPES và USERS
CREATE TABLE TICKETS (
                         TICKET_ID VARCHAR2(50 BYTE) NOT NULL,
                         TICKET_TYPE_ID VARCHAR2(50 BYTE) NOT NULL,
                         EVENT_ID VARCHAR2(50 BYTE) NOT NULL,
                         USER_ID VARCHAR2(50 BYTE) NOT NULL,
                         STATUS VARCHAR2(20 BYTE) NOT NULL,
                         PURCHASE_DATE TIMESTAMP(6),
                         CREATED_AT TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
                         UPDATED_AT TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT PK_TICKETS PRIMARY KEY (TICKET_ID),
                         CONSTRAINT FK_TICKETS_TICKET_TYPE_ID FOREIGN KEY (TICKET_TYPE_ID) REFERENCES TICKETTYPES(TICKET_TYPE_ID),
                         CONSTRAINT FK_TICKETS_EVENT_ID FOREIGN KEY (EVENT_ID) REFERENCES EVENTS(EVENT_ID),
                         CONSTRAINT FK_TICKETS_USER_ID FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID)
);

-- Tạo bảng ORDERS, tham chiếu đến USERS và TICKET_TYPES
CREATE TABLE ORDERS (
                        ORDER_ID VARCHAR2(50 BYTE) NOT NULL,
                        USER_ID VARCHAR2(50 BYTE) NOT NULL,
                        EVENT_ID VARCHAR2(50 BYTE) NOT NULL,
                        TICKET_TYPE_ID VARCHAR2(50 BYTE) NOT NULL,
                        QUANTITY NUMBER(10,0) NOT NULL,
                        PRICE NUMBER(10,2) NOT NULL,
                        TOTAL_AMOUNT NUMBER(15,2) NOT NULL,
                        ORDER_DATE TIMESTAMP(6) NOT NULL,
                        STATUS VARCHAR2(20 BYTE) NOT NULL,
                        PAYMENT_METHOD VARCHAR2(50 BYTE),
                        PAYMENT_STATUS VARCHAR2(20 BYTE),
                        TRANSACTION_ID VARCHAR2(100 BYTE),
                        DISCOUNT NUMBER(15,2) DEFAULT 0,
                        CREATED_AT TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
                        UPDATED_AT TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT PK_ORDERS PRIMARY KEY (ORDER_ID),
                        CONSTRAINT FK_ORDERS_USER_ID FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID),
                        CONSTRAINT FK_ORDERS_EVENT_ID FOREIGN KEY (EVENT_ID) REFERENCES EVENTS(EVENT_ID),
                        CONSTRAINT FK_ORDERS_TICKET_TYPE_ID FOREIGN KEY (TICKET_TYPE_ID) REFERENCES TICKETTYPES(TICKET_TYPE_ID)
);


Insert into USERS (USER_ID,USERNAME,EMAIL,PASSWORD_HASH,ROLE,LAST_LOGIN,FULL_NAME,DOB,PHONE_NUMBER,GENDER,RESET_TOKEN,RESET_TOKEN_EXPIRY) values ('492820da-5512-4542-831f-21ef15408b1e','testuser5','test5@eventory.vn','$2a$10$RuLeqH/tqNVxsX3T2GHkqOgWIavM5j5k49J3OEyWS4yRiimRMoHhi','user',to_timestamp('28-MAY-25 01.07.06.940916000 AM','DD-MON-RR HH.MI.SSXFF AM'),null,null,null,null,null,null);
Insert into USERS (USER_ID,USERNAME,EMAIL,PASSWORD_HASH,ROLE,LAST_LOGIN,FULL_NAME,DOB,PHONE_NUMBER,GENDER,RESET_TOKEN,RESET_TOKEN_EXPIRY) values ('4de76c74-665c-4eb1-90bc-f307f9477dd8','dohaidang','dohaidang@gmail.com','$2a$10$UFBp.V85JyosKWnMYmCzVeTlAVthisadTli8n94unHtt0hnWCdQ76','user',to_timestamp('03-JUN-25 10.13.52.971403000 PM','DD-MON-RR HH.MI.SSXFF AM'),null,null,null,null,null,null);

INSERT INTO EVENTS (
    EVENT_ID,
    TITLE,
    CITY,
    POSTER,
    POSTER_SUB,
    VIDEO,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    TICKET_SALE_START,
    TICKET_SALE_END,
    ORGANIZER_NAME,
    ORGANIZER_LOGO,
    CREATED_AT,
    UPDATED_AT,
    FORMAT,
    USER_ID,
    DESCRIPTION,
    ORGANIZER_DESCRIPTION
) VALUES (
    '8c4e1378-de2b-458f-af01-1cf47e528dae',
    'SOOBIN Live Concert 2025',
    'Hồ Chí Minh',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748962682/poster_soobin_1_jx5kf5.jpg',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748966696/poster_soobin_2_kic76f.jpg',
    NULL,
    to_timestamp(
        '01-JUL-25 07.00.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '01-JUL-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Nhà hát Hòa Bình, Hồ Chí Minh',
    to_timestamp(
        '20-MAY-25 12.00.00.000000000 AM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '30-JUN-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'SpaceSpeakers Group',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748959263/webve/org-logo/zhvcar7nyqisrynqhrf8.png',
    to_timestamp(
        '03-JUN-25 09.01.04.561000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '03-JUN-25 09.01.04.561000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Offline',
    '4de76c74-665c-4eb1-90bc-f307f9477dd8',
    'SOOBIN tổ chức show diễn solo cực kỳ đặc biệt nhân dịp kỷ niệm sự nghiệp.

Special Experience:
- Gặp gỡ ký tặng SOOBIN
- Poster giới hạn',
    '.................................'
);

INSERT INTO EVENTS (
    EVENT_ID,
    TITLE,
    CITY,
    POSTER,
    POSTER_SUB,
    VIDEO,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    TICKET_SALE_START,
    TICKET_SALE_END,
    ORGANIZER_NAME,
    ORGANIZER_LOGO,
    CREATED_AT,
    UPDATED_AT,
    FORMAT,
    USER_ID,
    DESCRIPTION,
    ORGANIZER_DESCRIPTION
) VALUES (
    '4fea402f-9fa5-4bf1-8678-02bdfea228f0',
    'BLACKPINK Encore Tour - Vietnam',
    'Hồ Chí Minh',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748959737/webve/poster/hmsezify1gtjirialk7z.webp',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748959739/webve/poster-sub/rnbqko7zbzfpkeneueox.webp',
    'https://res.cloudinary.com/dy5gl0qm1/video/upload/v1748959744/webve/video/niajqgvfj0xe4fjxzzqt.mp4',
    to_timestamp(
        '25-JUL-25 07.00.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '25-JUL-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Sân vận động Thống Nhất, Hồ Chí Minh',
    to_timestamp(
        '10-JUN-25 12.00.00.000000000 AM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '24-JUL-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'YG Entertainment',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748959747/webve/org-logo/cgeov4pyiinpi95mcmnu.png',
    to_timestamp(
        '03-JUN-25 09.09.08.535000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '03-JUN-25 09.09.08.535000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Offline',
    '4de76c74-665c-4eb1-90bc-f307f9477dd8',
    '"BLACKPINK chính thức tổ chức encore concert cực hoành tráng tại Việt Nam.

Special Experience:
- VIP Soundcheck Experience
- Tặng card member BP"',
    '.................................'
);

INSERT INTO EVENTS (
    EVENT_ID,
    TITLE,
    CITY,
    POSTER,
    POSTER_SUB,
    VIDEO,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    TICKET_SALE_START,
    TICKET_SALE_END,
    ORGANIZER_NAME,
    ORGANIZER_LOGO,
    CREATED_AT,
    UPDATED_AT,
    FORMAT,
    USER_ID,
    DESCRIPTION,
    ORGANIZER_DESCRIPTION
) VALUES (
    'b4c63ef8-d0b1-4f94-bbaf-37843bd557ab',
    'TWICE 5th World Tour - Vietnam',
    'Hồ Chí Minh',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748964226/webve/poster/esmi5scl7ctaq1n16qqg.jpg',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748964236/webve/poster-sub/aievyqmaxgft3cmyibwp.jpg',
    NULL,
    to_timestamp(
        '10-AUG-25 12.00.00.000000000 AM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '10-AUG-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'SVĐ Quân khu 7, Phường 02, Quận Tân Bình, Hồ Chí Minh',
    to_timestamp(
        '20-JUN-25 12.00.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '09-AUG-25 12.00.00.000000000 AM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'JYP Entertainment',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748964238/webve/org-logo/qvddttwib5pk7ztt9gtx.png',
    to_timestamp(
        '03-JUN-25 10.24.01.103000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '03-JUN-25 10.24.01.103000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Offline',
    '4de76c74-665c-4eb1-90bc-f307f9477dd8',
    'TWICE lần đầu tiên tổ chức world tour tại Việt Nam, hứa hẹn bùng nổ cảm xúc.

Special Experience:
- Soundcheck package
- Tặng postcard TWICE',
    '.............................'
);

INSERT INTO EVENTS (
    EVENT_ID,
    TITLE,
    CITY,
    POSTER,
    POSTER_SUB,
    VIDEO,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    TICKET_SALE_START,
    TICKET_SALE_END,
    ORGANIZER_NAME,
    ORGANIZER_LOGO,
    CREATED_AT,
    UPDATED_AT,
    FORMAT,
    USER_ID,
    DESCRIPTION,
    ORGANIZER_DESCRIPTION
) VALUES (
    '23062922-9506-43e6-85b3-08805df847fb',
    'BTS - Map Of The Soul Tour',
    'Hà Nội',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748957987/webve/poster/rbeyr6mbjxsdcywqoyhs.jpg',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748957990/webve/poster-sub/h1wop1rmvkl637grypz0.webp',
    NULL,
    to_timestamp(
        '12-JUN-25 07.30.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '12-JUN-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'SVĐ Mỹ Đình, Hà Nội',
    to_timestamp(
        '01-MAY-25 12.00.00.000000000 AM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '11-JUN-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Bit Hit Music',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748957992/webve/org-logo/slmtbdpeitgg53c78pwe.png',
    to_timestamp(
        '03-JUN-25 08.39.54.801000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '03-JUN-25 08.39.54.801000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Offline',
    '4de76c74-665c-4eb1-90bc-f307f9477dd8',
    'BTS trở lại với những bản hit khuấy động sân khấu, màn trình diễn ánh sáng đỉnh cao và hiệu ứng pháo hoa.

Special Experience:
- Tặng lightstick phiên bản đặc biệt
- Thẻ thành viên sự kiện
- Được bốc thăm ký tên

Promotion:
- Giảm 5% cho học sinh, sinh viên (Xuất trình thẻ sinh viên còn hiệu lực)',
    '.................................'
);

INSERT INTO EVENTS (
    EVENT_ID,
    TITLE,
    CITY,
    POSTER,
    POSTER_SUB,
    VIDEO,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    TICKET_SALE_START,
    TICKET_SALE_END,
    ORGANIZER_NAME,
    ORGANIZER_LOGO,
    CREATED_AT,
    UPDATED_AT,
    FORMAT,
    USER_ID,
    DESCRIPTION,
    ORGANIZER_DESCRIPTION
) VALUES (
    '991423b4-2799-479a-a594-08c9d07df297',
    'EXID - 2025 World Tour',
    'Đà Nẵng',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748959010/webve/poster/p0d1bmx3mrgd9lrrah6g.jpg',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748959015/webve/poster-sub/s4zp8s2srvlt0sgmbfll.jpg',
    'https://res.cloudinary.com/dy5gl0qm1/video/upload/v1748959019/webve/video/ybugdxk9tlachwm1qfn5.mp4',
    to_timestamp(
        '20-JUN-25 08.00.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '20-JUN-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Sân vận động Chi Lăng, Đà Nẵng',
    to_timestamp(
        '10-MAY-25 12.00.00.000000000 AM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '19-JUN-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'EXID Entertainment',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748959022/webve/org-logo/qd3obhctotixgyz7x1ms.png',
    to_timestamp(
        '03-JUN-25 08.57.04.177000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '03-JUN-25 08.57.04.177000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Offline',
    '4de76c74-665c-4eb1-90bc-f307f9477dd8',
    'EXID tổ chức đêm nhạc cháy bỏng tại Việt Nam với những bản hit huyền thoại.

Special Experience:
- Meet and Greet với EXID
- Photo Card giới hạn

Promotion:
- Giảm 10% cho nhóm từ 5 người trở lên
- Đăng ký theo nhóm cùng lúc',
    '.................................'
);

INSERT INTO EVENTS (
    EVENT_ID,
    TITLE,
    CITY,
    POSTER,
    POSTER_SUB,
    VIDEO,
    START_DATE_TIME,
    END_DATE_TIME,
    LOCATION,
    TICKET_SALE_START,
    TICKET_SALE_END,
    ORGANIZER_NAME,
    ORGANIZER_LOGO,
    CREATED_AT,
    UPDATED_AT,
    FORMAT,
    USER_ID,
    DESCRIPTION,
    ORGANIZER_DESCRIPTION
) VALUES (
    '08553bda-7881-4248-a7c2-7fa223bceb9f',
    'BABYMONSTER - Hello Monsters Tour',
    'Hồ Chí Minh',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748948320/webve/poster/oeco2x9mg6jrctvzalvp.jpg',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748948323/webve/poster-sub/wry8mbwawrete8lit6tm.jpg',
    'https://res.cloudinary.com/dy5gl0qm1/video/upload/v1748948329/webve/video/ijvlmoxmyf5qwdgbzyau.mp4',
    to_timestamp(
        '31-MAY-25 06.00.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '31-MAY-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'SECC, Phường Tân Phú, Quận 7, Hồ Chí Minh',
    to_timestamp(
        '15-APR-25 12.00.00.000000000 AM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '30-MAY-25 11.59.00.000000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Live Nation Vietnam',
    'https://res.cloudinary.com/dy5gl0qm1/image/upload/v1748948332/webve/org-logo/krmyvlkcyccrn0nbkrr5.png',
    to_timestamp(
        '03-JUN-25 05.58.54.163000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    to_timestamp(
        '03-JUN-25 05.58.54.163000000 PM',
        'DD-MON-RR HH.MI.SSXFF AM'
    ),
    'Offline',
    '4de76c74-665c-4eb1-90bc-f307f9477dd8',
    'BABYMONSTER trở lại với tour diễn đầu tiên tại Việt Nam, mang đến những tiết mục độc quyền chỉ có tại SECC.

Special Experience:
- Tặng poster BABYMONSTER
- Nhận sticker độc quyền
- Photo zone check-in',
    '.................................'
);

Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('21f0e743-754a-4038-9a43-2bca006ea8fb','991423b4-2799-479a-a594-08c9d07df297','STANDARD',2500000,750,to_timestamp('03-JUN-25 08.57.04.192000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 08.57.04.192000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('10-MAY-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('19-JUN-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('391e52b3-20c0-467e-8682-e2c29ddbed46','8c4e1378-de2b-458f-af01-1cf47e528dae','SOOBIN ZONE',2800000,400,to_timestamp('03-JUN-25 09.01.04.567000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 09.01.04.567000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('20-MAY-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('30-JUN-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('da40d221-8efd-483f-864b-e6dacf439a5e','8c4e1378-de2b-458f-af01-1cf47e528dae','STANDARD',1800000,600,to_timestamp('03-JUN-25 09.01.04.573000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 09.01.04.573000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('20-MAY-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('30-JUN-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('16e70d23-1047-4978-b8d3-b5be967f1d71','23062922-9506-43e6-85b3-08805df847fb','ARMY VIP',6000000,300,to_timestamp('03-JUN-25 08.39.54.814000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 08.39.54.814000000 PM','DD-MON-RR HH.MI.SSXFF AM'),2,to_timestamp('01-MAY-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('11-JUN-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('feeb00f2-b02d-4bd6-8636-50e785eca217','4fea402f-9fa5-4bf1-8678-02bdfea228f0','VIP',8500000,500,to_timestamp('03-JUN-25 09.09.08.545000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 09.09.08.545000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('10-JUN-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('24-JUL-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('d79eb0e8-4fc8-4913-9963-c4a58227cd3e','4fea402f-9fa5-4bf1-8678-02bdfea228f0','STANDARD',4000000,1500,to_timestamp('03-JUN-25 09.09.08.547000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 09.09.08.547000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('10-JUN-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('24-JUL-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('e2af4498-e8ce-41f5-b588-26c8a09aec7a','b4c63ef8-d0b1-4f94-bbaf-37843bd557ab','VIP',7200000,400,to_timestamp('03-JUN-25 10.24.01.136000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 10.24.01.136000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('20-JUN-25 12.00.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('09-AUG-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('e8605619-22db-43c6-8814-23c646dc1f86','23062922-9506-43e6-85b3-08805df847fb','GENERAL',3500000,1000,to_timestamp('03-JUN-25 08.39.54.818000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 08.39.54.818000000 PM','DD-MON-RR HH.MI.SSXFF AM'),2,to_timestamp('01-MAY-25 12.00.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('11-JUN-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('269ba637-1c29-4579-a96c-058fbc19dce7','991423b4-2799-479a-a594-08c9d07df297','PREMIUM',420000,250,to_timestamp('03-JUN-25 08.57.04.190000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 08.57.04.190000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('10-MAY-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('19-JUN-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('d0cc9bbd-de4d-4bd9-bbf4-349e0a715ab4','b4c63ef8-d0b1-4f94-bbaf-37843bd557ab','STANDARD',3900000,1400,to_timestamp('03-JUN-25 10.24.01.139000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 10.24.01.139000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('20-JUN-25 12.00.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('09-AUG-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('d9f0a5ab-f34c-4d6d-af09-b0b756bfd2d6','08553bda-7881-4248-a7c2-7fa223bceb9f','VIP PACKAGE - L',5500000,200,to_timestamp('03-JUN-25 05.58.54.170000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 05.58.54.170000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('15-APR-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('30-MAY-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('15a2a341-42a3-4923-a94c-615bc93b547d','08553bda-7881-4248-a7c2-7fa223bceb9f','CAT 1 - L',4200000,200,to_timestamp('03-JUN-25 05.58.54.173000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 05.58.54.173000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('15-APR-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('30-MAY-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('208bcca6-e09b-46ea-ab95-6322277aab84','08553bda-7881-4248-a7c2-7fa223bceb9f','CAT 2 - L',3400000,150,to_timestamp('03-JUN-25 05.58.54.176000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 05.58.54.176000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('15-APR-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('30-MAY-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));
Insert into TICKETTYPES (TICKET_TYPE_ID,EVENT_ID,TYPE,PRICE,QUANTITY,CREATED_AT,UPDATED_AT,MAX_PER_ORDER,TICKET_SALE_START,TICKET_SALE_END) values ('3f011dac-2f16-49b5-84c6-cc5630aa8b85','08553bda-7881-4248-a7c2-7fa223bceb9f','CAT 3 - L',2800000,200,to_timestamp('03-JUN-25 05.58.54.178000000 PM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('03-JUN-25 05.58.54.178000000 PM','DD-MON-RR HH.MI.SSXFF AM'),1,to_timestamp('15-APR-25 12.00.00.000000000 AM','DD-MON-RR HH.MI.SSXFF AM'),to_timestamp('30-MAY-25 11.59.00.000000000 PM','DD-MON-RR HH.MI.SSXFF AM'));

--DROP TABLE TICKETS CASCADE CONSTRAINTS;
--DROP TABLE TICKETTYPES CASCADE CONSTRAINTS;
--DROP TABLE EVENTS CASCADE CONSTRAINTS;
--DROP TABLE USERSESSIONS CASCADE CONSTRAINTS;
--DROP TABLE USERS CASCADE CONSTRAINTS;
