--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10
-- Dumped by pg_dump version 14.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: generate_catalog_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_catalog_number() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.catalog_number IS NULL THEN
    NEW.catalog_number := nextval('catalog_number_seq');
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: catalog_number_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.catalog_number_seq
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS  public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    image_url character varying(255),
    products_number integer
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE IF NOT EXISTS public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.products (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    price numeric(10,2) NOT NULL,
    image_url character varying(255),
    category_id integer,
    description character varying(1000) NOT NULL,
    pdf_url character varying(2083),
    catalog_number bigint,
    discount_price numeric,
    rating integer,
    created_at date DEFAULT CURRENT_DATE,
    rating_friendly integer,
    rating_security integer,
    number_of_purchases integer,
    CONSTRAINT products_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT products_rating_check1 CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT products_rating_check2 CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE IF NOT EXISTS public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;





--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.reviews (
    review_id integer NOT NULL,
    review_title text NOT NULL,
    review_text text NOT NULL,
    user_name text NOT NULL,
    product_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories VALUES (1, 'CRM Software', 'Customer relationship management system', 'categories_images/CRM_Software.png', 5);
INSERT INTO public.categories VALUES (2, 'Analytics Software', 'Software designed for collecting, processing, and analyzing data', 'categories_images/Analytics_Software.png', 5);
INSERT INTO public.categories VALUES (3, 'ERP Software', 'Software designed for overall management of business processes', 'categories_images/ERP_Software.png', 5);
INSERT INTO public.categories VALUES (4, 'Programming Software', 'Software used by developers to write, edit, test, and debug software code', 'categories_images/Programming_Software.png', 5);
INSERT INTO public.categories VALUES (5, 'Backup Software', 'Backup software is designed to create copies against data loss, system errors, or malfunctions', 'categories_images/Backup_Software.png', 5);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products VALUES (10001, 'Sales Linker', 2000.00, 'products_images/Sales_Linker_image.jpg', 1, 'Sales Linker is a CRM system that focuses specifically on sales and consulting teams, with tools that allow them to maximize the potential of each lead and turn it into a paying customer. The platform includes a smart task management system that ensures that every sales employee is on the right track, stays in touch with the customer and documents every step of the sales process. Tools such as automated lead management, real-time updates and sales action tracking allow teams to respond quickly to changes and a variety of business opportunities. The system provides direct integrations with marketing systems, so sales teams can know exactly who opened the email, who visited the website and who is on the verge of a purchase. With the ability to streamline the entire process, Sales Linker helps businesses increase sales and improve conversion rates.', 'product_brochures/Sales_Linker.pdf', 1002, 1890, 3, '2025-01-13', 3, 2, 0);
INSERT INTO public.products VALUES (10008, 'Predict IQ', 1767.00, 'products_images/Predict_IQ_image.jpg', 2, 'Predict IQ is an advanced analytics platform focused on intelligent predictive analytics for businesses. The system uses advanced data analysis models to predict customer behavior, market trends, and the business environment in general. With Predict IQ, businesses can identify next steps in sales, marketing, and other operations, thereby avoiding mistakes and maximizing their potential. The system provides tools to improve inventory efficiency, predict market demand, and optimize marketing campaigns. Predict IQ helps businesses take proactive actions based on predictions, thereby gaining a competitive advantage.', 'product_brochures/Predict_IQ.pdf', 1009, NULL, 4, '2025-01-13', 3, 4, 0);
INSERT INTO public.products VALUES (10011, 'Next Flow ERP', 1000.00, 'products_images/Next_Flow_ERP_image.jpg', 3, 'Next Flow ERP offers a smart ERP solution that centralizes all business information under one platform. The system is especially suitable for companies in the manufacturing, logistics and service industries, and provides advanced tools for project management, marketing, inventory, supply chain and accounting. Next Flow ERP is characterized by high integration with third-party systems, which allows it to be a flexible solution that easily connects to other platforms. With Next Flow ERP, organizations can monitor performance in real time, identify potential problems before they happen and respond quickly to market changes. The system includes tools for managing automated processes, tracking projects and producing customized reports, which help make informed business decisions.', 'product_brochures/Next_Flow_ERP.pdf', 1012, NULL, 4, '2025-01-13', 2, 5, 0);
INSERT INTO public.products VALUES (10019, 'Smart Der Studio', 1899.00, 'products_images/Smart_Der_Studio_image.jpg', 4, 'Smart Dev Studio is an advanced software development software designed for developers and teams working on complex projects. It provides an integrated environment for developing, testing, and debugging applications across multiple platforms. The system supports many programming languages, including C#, Python, JavaScript, and more. SmartDev Studio offers intelligent code suggestions, a dynamic debugging interface, and integrated testing environments, helping developers identify errors early in the development process. With built-in integration for version control and project management tools, Smart Dev Studio ensures seamless collaboration and high productivity, making it an essential tool for both independent programmers and development teams.', 'product_brochures/Smart_Der_Studio.pdf', 1020, NULL, 5, '2025-01-13', 3, 2, 0);
INSERT INTO public.products VALUES (10006, 'Insight Matrix', 2100.00, 'products_images/Insight_Matrix_image.jpg', 2, 'Insight Matrix is ​​an advanced analytics platform that enables businesses to perform in-depth analyses of internal and external data to identify new opportunities and streamline business operations. Using intelligent algorithms, Insight Matrix can analyze large amounts of data and offer precise insights that help companies understand market trends and act accordingly. The system offers options such as risk analysis, forecasting future trends, and creating customized reports for each business area. Insight Matrix also offers tools for collaboration within business teams, so you can work together on analyses and get the most out of the data available.', 'product_brochures/Insight_Matrix.pdf', 1007, NULL, 2, '2025-01-13', 4, 3, 0);
INSERT INTO public.products VALUES (10002, 'Customer Xpert', 1250.00, 'products_images/Customer_Xpert_image.jpg', 1, 'Customer Xpert is a powerful CRM system that simplifies the entire process of customer relationship management and service. Using advanced technology and integration with various systems, Customer Xpert allows businesses to manage all customer information in one place, and customize their value proposition personally for each customer. The system includes tools for managing sales, customer service, and marketing, which allow businesses to manage interactions with customers professionally and effectively. The system is based on smart algorithms for analyzing customer behavior, which help create more targeted and effective marketing strategies. In addition, Customer Xpert provides tools for managing customer portfolios effectively, which helps provide high-level customer service and foster long-term relationships.', 'product_brochures/Customer_Xpert.pdf', 1003, NULL, 5, '2025-01-13', 1, 1, 0);
INSERT INTO public.products VALUES (10003, 'Relate Pro', 1990.00, 'products_images/Relate_Pro_image.jpg', 1, 'Relate Pro is a customized CRM system based on the principles of long-term customer relationships. The system offers customized solutions for every type of business, and provides tools for managing sales, marketing, and service in an integrated and focused manner. With RelatePro, businesses can manage all interactions with customers, develop customized marketing strategies, and improve customer relationships. The system includes advanced automation of business processes, so that every marketing, sales, or service operation is carried out smoothly and effectively. Tools such as real-time data analysis, customized reports, and an efficient task management system help teams track customer activities and provide them with the best service. Relate Pro also supports integration with additional platforms such as social networks, mailing systems, and cloud services, allowing businesses to expand their capabilities and simplify work processes.', 'product_brochures/Relate_Pro.pdf', 1004, NULL, 3, '2025-01-13', 4, 5, 0);
INSERT INTO public.products VALUES (10000, 'Client Sphere', 1600.00, 'products_images/Client_Sphere_image.jpg', 1, 'Client Sphere is an advanced CRM system that brings significant improvements in customer relationship management to businesses of all sizes. With an intuitive and simple user interface, the system offers a variety of tools for managing sales, marketing and customer service in a smart and focused way. The platform offers advanced automation, which saves time by automatically managing marketing and sales tasks, as well ass realtime data analysis that helps make accurate and informed decisions. With Client Sphere, businesses can create a personalized customer experience, improve customer satisfaction and it a flexible solution that suits any business need.', 'product_brochures/Client_Sphere.pdf', 1001, 1400, 4, '2025-01-13', 2, 5, 0);
INSERT INTO public.products VALUES (10005, 'Data Insight', 970.00, 'products_images/Data_Insight_image.jpg', 2, 'Data Insight is a smart analytics system designed to help businesses analyze and understand their data in an automated and focused way. With real-time data analysis capabilities, Data Insight identifies trends, patterns, and changes in data and provides insights that can improve business decision-making. The system includes customized tools for analyzing sales, customer, marketing, and performance data. Data Insight provides an intuitive user interface, allowing business teams to understand data and respond quickly to market changes. With process automation, custom report creation, and integration with other systems, Data Insight is an excellent solution for businesses looking to improve performance and focus on success.', 'product_brochures/Data_Insight.pdf', 1006, 799, 3, '2025-01-13', 4, 2, 0);
INSERT INTO public.products VALUES (10024, 'Backup Xpert', 1920.00, 'products_images/Backup_Xpert_image.jpg', 5, 'Backup Xpert is a data backup and recovery software designed for professional users and businesses that are the leaders in the market. The software provides full and measured data backup with options to freeze files during backup, so that there are no changes while the backup is being performed. Backup Xpert also supports cloud backup services, and allows you to restore data immediately and for free in the event of data loss. The software also includes options to schedule backups automatically, so that data is preserved to the maximum extent possible and without the need for manual intervention.', 'product_brochures/Backup_Xpert.pdf', 1000, NULL, 5, '2025-01-13', 4, 1, 0);
INSERT INTO public.products VALUES (10013, 'Synergy One ERP', 690.00, 'products_images/Synergy_One_ERP_image.jpg', 3, 'Synergy One ERP offers a powerful ERP solution designed for companies with advanced requirements in the fields of production, financial management and logistics. The system includes various modules for inventory management, projects, sales, finance and human resources, while maintaining a comprehensive picture of all business processes. With smart integration between the various modules, Synergy One ERP ensures that all information is available in a centralized and updated form in real time. The system also includes tools for forecast management, automatic data analysis and support for data-based decision-making. Synergy One enables the automation of routine processes, predicts problems before they occur and provides flexible solutions for all types of businesses.', 'product_brochures/Synergy_One_ERP.pdf', 1014, NULL, 5, '2025-01-13', 2, 3, 0);
INSERT INTO public.products VALUES (10014, 'Vision ERP', 1500.00, 'products_images/Vision_ERP_image.jpg', 3, 'Vision ERP is a flexible ERP system based on cloud technology, enabling the management of all aspects of the business in an organized and efficient manner. The system includes modules for financial management, operations management, human resources, logistics and customer service, all of which present a complete picture of the entire operation of the business in real time. Vision ERP provides tools for monitoring performance, creating future forecasts, automating marketing processes and the ability to fully control inventory management. The system offers an intuitive user interface and enables integration with third-party systems. Vision ERP helps businesses not only improve efficiency, but also meet market expectations and maintain a competitive advantage.', 'product_brochures/Vision_ERP.pdf', 1015, NULL, 4, '2025-01-13', 4, 5, 0);
INSERT INTO public.products VALUES (10015, 'Code Craft Pro', 1400.00, 'products_images/Code_Craft_Pro_image.jpg', 4, 'Code Craft Pro is an advanced development environment designed for developers looking for efficiency and accuracy during the coding process. With support for many programming languages ​​such as Python, Java, C++ and JavaScript, it provides advanced tools for debugging, code refactoring and version control. Its intuitive interface helps streamline the coding process, making work more convenient and faster. Code Craft Pro includes smart code suggestions, error highlighting and comprehensive documentation, which are a significant addition to productivity and error reduction. With built-in support for cloud integration and collaboration features, it is a perfect system for both independent developers and teams working on large-scale projects.', 'product_brochures/Code_Craft_Pro.pdf', 1016, 1200, 4, '2025-01-13', 4, 5, 0);
INSERT INTO public.products VALUES (10004, 'Connectify CRM', 1670.00, 'products_images/Connectify_CRM_image.jpg', 1, 'Connectify CRM is a smart CRM system designed for businesses looking for a comprehensive solution for managing customer relationships and improving customer relationships. The system includes advanced features that allow businesses to manage all customer interactions seamlessly, using data to optimize processes. Connectify CRM offers tools for managing sales, marketing, and customer service, which enable the creation of meaningful relationships with customers, improving satisfaction levels, and increasing retention rates. With advanced analytics, integrations with third-party applications, and the ability to automate various processes, Connectify CRM ensures that businesses can focus on growth and improving customer service without spending valuable time managing routine tasks. The system provides tools for managing leads, automating marketing tasks, and tracking performance, all in a friendly and accessible user interface, allowing businesses to focus on what really matters.', 'product_brochures/Connectify_CRM.pdf', 1005, NULL, 4, '2025-01-13', 5, 1, 0);
INSERT INTO public.products VALUES (10007, 'Trend Fusion', 1234.00, 'products_images/Trend_Fusion_image.jpg', 2, 'Trend Fusion is a powerful analytics system focused on identifying trends and forecasting for businesses. With the ability to analyze market data, sociology, and customer needs, Trend Fusion offers tools that help businesses stay one step ahead of the competition. The system uses machine learning to identify patterns and predict future trends, providing insights that help make better decisions. Trend Fusion also offers graphical and dynamic reports, allowing users to understand the data in a visual and clear way. The platform supports the definition of business goals, and includes tools for performance improvement and targeted marketing.', 'product_brochures/Trend_Fusion.pdf', 1008, 1100, 5, '2025-01-13', 1, 2, 0);
INSERT INTO public.products VALUES (10010, 'Core Enterprise', 580.00, 'products_images/Core_Enterprise_image.jpg', 3, 'Core Enterprise is a comprehensive ERP system designed for businesses of all sizes. The platform offers customized solutions for every area of ​​organizational activity, including financial management, inventory management, sales management, marketing, human resources and projects. With Core Enterprise, businesses can streamline all their internal processes, improve collaboration between teams and ensure that information is available to all relevant parties in real time. The system is based on cloud technology, which allows employees to access it quickly and conveniently from anywhere. With automated tools for managing cash flows, calculating taxes, creating customized reports and managing resources, Core Enterprise helps businesses increase efficiency and minimize operational errors.', 'product_brochures/Core_Enterprise.pdf', 1011, NULL, 3, '2025-01-13', 5, 4, 0);
INSERT INTO public.products VALUES (10012, 'Optima ERP', 1300.00, 'products_images/Optima_ERP_image.jpg', 3, 'Optima ERP is an ERP system developed specifically for companies in the retail and service sectors, and provides comprehensive solutions for managing various business processes. The system provides tools for order management, supplier management, accounting management, resource planning and performance tracking. Optima ERP is characterized by the ability to manage automated tasks such as sending quotes to customers, managing emails and reminders, as well as real-time data analysis that helps identify business opportunities. With an easy and convenient interface, Optima ERP allows users to integrate different business processes, while maintaining high performance and providing a personalized user experience for each team and field.', 'product_brochures/Optima_ERP.pdf', 1013, 1225, 5, '2025-01-13', 3, 1, 0);
INSERT INTO public.products VALUES (10017, 'Prog Master IDE', 2100.00, 'products_images/Prog_Master_IDE_image.jpg', 4, 'Prog Master IDE is an integrated software development platform that includes powerful tools for professional programmers. It combines powerful features that suit both beginners and experienced developers, such as syntax highlighting, code completion, real-time error detection, and performance profiling tools. Prog Master supports a variety of programming languages ​​such as Ruby, PHP, Swift, and Kotlin, with the ability to extend it with custom plugins. The system also includes a virtual testing environment that allows developers to test their code in real environments. With seamless integration with Git, automated build tools, and support for unit testing, Prog Master helps streamline the development process from writing to deployment.', 'product_brochures/Prog_Master_IDE.pdf', 1018, NULL, 3, '2025-01-13', 5, 3, 0);
INSERT INTO public.products VALUES (10021, 'Cloud Safe Backup', 999.00, 'products_images/Cloud_Safe_Backup_image.jpg', 5, 'Cloud Safe Backup is a data backup software that combines local backup with cloud backup, ensuring accessible and protected data backup from anywhere and at any time. The software offers full or partial system backup, supports automatic backup, and performs ongoing synchronization with leading cloud servers. Cloud Safe Backup offers high-level encryption and provides secure access to backed up data. In addition, it has a unique real-time backup system for important files, so that if there is a change in the files, they are automatically and immediately backed up, without disturbing the user.', 'product_brochures/Cloud_Safe_Backup.pdf', 1022, NULL, 4, '2025-01-13', 2, 2, 0);
INSERT INTO public.products VALUES (10022, 'Data Protect Pro', 1460.00, 'products_images/Data_Protect_Pro_image.jpg', 5, 'Data Protect Pro is an advanced data backup and recovery software designed to offer comprehensive solutions for protecting important information. With local and cloud backup capabilities, it allows you to back up any type of information, including photos, documents, software, and system data. The system includes fast recovery tools that allow you to restore data in real time, in the event of loss or deletion. Data Protect Pro offers high-level encryption protection and provides the option to schedule automatic backups, so users can rest assured that all their data is backed up on time and securely.', 'product_brochures/Data_Protect_Pro.pdf', 1023, 1360, 4, '2025-01-13', 4, 5, 0);
INSERT INTO public.products VALUES (10023, 'Quick Backup', 1760.00, 'products_images/Quick_Backup_image.jpg', 5, 'Quick Backup is a data backup software designed to make the backup process simple and fast, even for non-tech-savvy users. The software supports local and cloud backup, and offers flexible backup options, including automatic backup based on time or file changes. Quick Backup offers smart encryption and fast recovery capabilities in case the user needs to recover damaged or deleted files or folders. With an intuitive and friendly interface, Quick Backup makes backup simple and understandable for anyone.', 'product_brochures/Quick_Backup.pdf', 1024, NULL, 3, '2025-01-13', 1, 5, 0);
INSERT INTO public.products VALUES (10020, 'Safe Guard Backup', 1120.00, 'products_images/Safe_Guard_Backup_image.jpg', 5, 'Safe Guard Backup is a data backup software that offers an automated, simple and efficient solution for backing up important files and data. The software supports local and cloud backup, and provides advanced encryption to ensure data integrity and protection. Safe Guard Backup has a user-friendly interface, which allows you to easily configure backup details. In addition, it supports automatic backup at a predefined time, so that any changes to the data are backed up immediately. The software also offers fast data recovery options in case you need to restore deleted files or folders.', 'product_brochures/Safe_Guard_Backup.pdf', 1021, NULL, 4, '2025-01-13', 1, 5, 0);
INSERT INTO public.products VALUES (10016, 'Der Fusion Studio', 1425.00, 'products_images/Der_Fusion_Studio_image.jpg', 4, 'Dev Fusion Studio is an advanced development environment that empowers developers to create, test, and deploy applications quickly and efficiently. The system supports a variety of programming languages, frameworks, and libraries, providing a customized environment for each developer. The system includes a real-time collaborative coding platform, which is ideal for group projects. With advanced debugging tools, performance profiling, and seamless integration with version control systems, Dev Fusion Studio ensures smooth development cycles and high code quality. It also includes built-in support for container-based applications, cloud services, and continuous integration (CI) pipelines.', 'product_brochures/Der_Fusion_Studio.pdf', 1017, NULL, 3, '2025-01-13', 1, 1, 0);
INSERT INTO public.products VALUES (10018, 'Code Lab Pro', 1599.00, 'products_images/Code_Lab_Pro_image.jpg', 4, 'Code Lab Pro is a flexible and versatile software development software that provides a smooth and efficient coding experience. It supports multiple programming languages, including popular languages ​​such as Java, Python, HTML, and CSS, allowing developers to work on a variety of projects, including websites, applications, and scripts. Code Lab Pro includes integrated tools for real-time collaboration, intelligent code completion, and debugging, as well as advanced integration with version control systems. Its flexible structure allows users to extend the functionality with external plugins, providing a customized environment for each developer. Whether you are developing applications, websites, or scripts, Code Lab Pro offers the tools required for fast, efficient, and reliable development.', 'product_brochures/Code_Lab_Pro.pdf', 1019, 1499, 5, '2025-01-13', 3, 1, 0);
INSERT INTO public.products VALUES (10009, 'Vision Analytics', 2000.00, 'products_images/Vision_Analytics_image.jpg', 2, 'Vision Analytics is an analytics system that focuses on understanding complex business processes and turning them into accessible and easy-to-understand information. With tools for managing data analysis and visualizing data, Vision Analytics allows users to create dynamic and accurate reports that present the information clearly. The system includes features such as predictive analysis, alerting to potential problems, and the ability to intuitively identify relationships between data. Vision Analytics can be used for a variety of areas such as sales analysis, finance, inventory management, and more. The system is based on artificial intelligence technology, which provides insights based on deep data analysis combined with predictive and forecasting capabilities.', 'product_brochures/Vision_Analytics.pdf', 1010, 1899, 3, '2025-01-13', 1, 3, 0);


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: catalog_number_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.catalog_number_seq', 1024, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 5, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 10024, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, false);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: products set_catalog_number; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_catalog_number BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.generate_catalog_number();


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

