create database stock_screener;
use stock_screener;

CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    symbol VARCHAR(20) UNIQUE
);

CREATE TABLE metrics (
    metric_id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE financial_results (
    company_id INT,
    metric_id INT,
    year INT,
    quarter TINYINT NOT NULL,
    value DECIMAL(15,2) NOT NULL,

    PRIMARY KEY (company_id, metric_id, year, quarter),

    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    FOREIGN KEY (metric_id) REFERENCES metrics(metric_id)
);

INSERT INTO companies (company_name, symbol) VALUES
('Tata Motors Ltd', 'TATAMOTORS'),
('Infosys Ltd', 'INFY');

INSERT INTO metrics (metric_name) VALUES
('Sales'),
('Expenses'),
('Operating Profit'),
('OPM %'),
('Interest'),
('Depreciation'),
('Profit Before Tax');

INSERT INTO financial_results 
(company_id, metric_id, year, quarter, value) VALUES
(1, 1, 2024, 0, 6769.00),   -- Sales
(1, 2, 2024, 0, 4609.00),   -- Expenses
(1, 3, 2024, 0, 2160.00),   -- Operating Profit
(1, 4, 2024, 0, 32.00),     -- OPM %
(1, 5, 2024, 0, 220.00),    -- Interest
(1, 6, 2024, 0, 454.00),    -- Depreciation
(1, 7, 2024, 0, 1666.00);   -- Profit Before Tax

INSERT INTO financial_results 
(company_id, metric_id, year, quarter, value) VALUES
(1, 1, 2025, 1, 2100.00),
(1, 2, 2025, 1, 1500.00),
(1, 3, 2025, 1, 600.00),
(1, 4, 2025, 1, 28.00);

-- Annual data → quarter = 0
-- Q1 → quarter = 1
-- Q2 → quarter = 2
-- Q3 → quarter = 3
-- Q4 → quarter = 4

SELECT * FROM companies;
SELECT * FROM metrics;
SELECT * FROM financial_results;

CREATE TABLE ratios (
    company_id INT,
    ratio_name VARCHAR(50),
    year INT,
    value DECIMAL(15,2),

    PRIMARY KEY (company_id, ratio_name, year),

    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

INSERT INTO ratios VALUES
(1,'Market Cap',2024,219148),
(1,'Current Price',2024,2285),
(1,'Stock PE',2024,53.7),
(1,'Book Value',2024,204),
(1,'Dividend Yield',2024,1.09),
(1,'ROCE',2024,25.7),
(1,'ROE',2024,20.6),
(1,'EPS',2024,40.1),
(1,'Price to Book',2024,11.2),
(1,'Debt to Equity',2024,0.18),
(1,'PEG Ratio',2024,6.39);

CREATE TABLE company_information (
    company_id INT PRIMARY KEY,
    about TEXT,
    key_points TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

select * from ratios;

INSERT INTO company_information (company_id, about, key_points)
VALUES
(
1,

'Tata Motors Limited is one of India’s largest automobile manufacturers and a part of the Tata Group. The company manufactures passenger vehicles, commercial vehicles, electric vehicles, and defense vehicles. It operates globally and owns well-known international brands such as Jaguar and Land Rover. Tata Motors has a strong presence in India’s commercial vehicle market and is expanding rapidly in the electric vehicle segment.',

'Business Segments:
1. Commercial Vehicles: Trucks, buses, and cargo vehicles used for transportation and logistics. Tata Motors is the market leader in India in this segment.
2. Passenger Vehicles: Includes hatchbacks, sedans, SUVs, and electric vehicles such as Nexon EV, Tiago EV, and others.
3. Jaguar Land Rover (JLR): Luxury automotive brands based in the UK that design and manufacture premium vehicles sold globally.
4. Electric Vehicles: Tata Motors is a leader in India’s EV market through its dedicated EV platform and growing EV portfolio.

Key Strengths:
- Market leader in Indian commercial vehicle segment
- Strong EV presence in India
- Global luxury brand portfolio through Jaguar Land Rover
- Strong backing of Tata Group and large distribution network'
);

select * from company_information;

CREATE TABLE shareholding_pattern (
    company_id INT,
    year INT,
    quarter TINYINT,

    promoter_shareholding DECIMAL(5,2),
    fii_shareholding DECIMAL(5,2),
    dii_shareholding DECIMAL(5,2),
    public_shareholding DECIMAL(5,2),
    others_shareholding DECIMAL(5,2),
    shareholders_count INT,

    PRIMARY KEY (company_id, year, quarter),

    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

INSERT INTO shareholding_pattern 
(company_id, year, quarter, promoter_shareholding, fii_shareholding, dii_shareholding, public_shareholding, others_shareholding, shareholders_count)
VALUES
(1, 2023, 1, 52.63, 17.02, 9.96, 20.32, 0.04, 1082650),
(1, 2023, 2, 52.63, 17.48, 10.01, 19.82, 0.04, 997455),
(1, 2023, 3, 52.63, 17.65, 10.01, 19.64, 0.04, 985216),
(1, 2023, 4, 52.63, 17.32, 10.52, 19.44, 0.04, 975319),
(1, 2024, 1, 52.63, 15.89, 11.61, 19.78, 0.04, 1105326),
(1, 2024, 2, 52.63, 15.27, 12.30, 19.68, 0.06, 1111601),
(1, 2024, 3, 52.63, 15.28, 13.10, 18.88, 0.05, 975807),
(1, 2024, 4, 52.63, 13.61, 13.98, 19.66, 0.05, 1192876),
(1, 2025, 1, 52.63, 12.23, 15.51, 19.51, 0.05, 1213836),
(1, 2025, 2, 52.63, 11.85, 20.98, 14.41, 0.07, 1171145),
(1, 2025, 3, 52.63, 11.64, 21.50, 14.09, 0.06, 1108404),
(1, 2025, 4, 52.63, 12.78, 21.08, 13.37, 0.06, 1000999);

select * from shareholding_pattern;