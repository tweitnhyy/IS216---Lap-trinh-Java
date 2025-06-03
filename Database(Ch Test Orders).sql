-- Tạo bảng USERS trước vì các bảng khác sẽ tham chiếu đến nó
CREATE TABLE USERS (
                       USER_ID VARCHAR2(50 BYTE) NOT NULL,
                       USERNAME VARCHAR2(50 BYTE) NOT NULL,
                       EMAIL VARCHAR2(100 BYTE) NOT NULL,
                       PASSWORD_HASH VARCHAR2(255 BYTE) NOT NULL,
                       ROLE VARCHAR2(20 BYTE) NOT NULL,
                       LAST_LOGIN TIMESTAMP(6),
                       FULL_NAME VARCHAR2(50 BYTE),
                       DOB DATE,
                       PHONE_NUMBER VARCHAR2(20 BYTE),
                       GENDER VARCHAR2(7 BYTE),
                       CONSTRAINT PK_USERS PRIMARY KEY (USER_ID)
);

-- Tạo bảng USER_SESSIONS, tham chiếu đến USERS
CREATE TABLE USER_SESSIONS (
                               SESSION_ID VARCHAR2(50 BYTE) NOT NULL,
                               USER_ID VARCHAR2(50 BYTE) NOT NULL,
                               TOKEN VARCHAR2(50 BYTE) NOT NULL,
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

-- Tạo bảng TICKET_TYPES, tham chiếu đến EVENTS
CREATE TABLE TICKET_TYPES (
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
                         CONSTRAINT FK_TICKETS_TICKET_TYPE_ID FOREIGN KEY (TICKET_TYPE_ID) REFERENCES TICKET_TYPES(TICKET_TYPE_ID),
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
                        CONSTRAINT FK_ORDERS_TICKET_TYPE_ID FOREIGN KEY (TICKET_TYPE_ID) REFERENCES TICKET_TYPES(TICKET_TYPE_ID)
);