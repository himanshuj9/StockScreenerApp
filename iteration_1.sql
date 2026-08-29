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

CREATE TABLE balance_sheet (
    company_id INT,
    year INT,

    equity_capital DECIMAL(15,2),
    reserves DECIMAL(15,2),
    borrowings DECIMAL(15,2),
    other_liabilities DECIMAL(15,2),
    total_liabilities DECIMAL(15,2),

    fixed_assets DECIMAL(15,2),
    cwip DECIMAL(15,2),
    investments DECIMAL(15,2),
    other_assets DECIMAL(15,2),
    total_assets DECIMAL(15,2),

    PRIMARY KEY (company_id, year),

    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

INSERT INTO balance_sheet
(company_id, year, equity_capital, reserves, borrowings,
 other_liabilities, total_liabilities,
 fixed_assets, cwip, investments, other_assets, total_assets)
VALUES

(1, 2015, 96, 4646, 418, 3754, 8914, 2660, 196, 1588, 4471, 8914),

(1, 2016, 96, 6429, 323, 3711, 10559, 3416, 107, 2712, 4324, 10559),

(1, 2017, 96, 7508, 560, 4241, 12405, 3304, 258, 2652, 6192, 12405),

(1, 2018, 96, 8314, 533, 4820, 13763, 3732, 1405, 2141, 6485, 13763),

(1, 2019, 96, 9375, 1320, 5459, 16249, 6497, 210, 2569, 6974, 16249),

(1, 2020, 96, 10034, 1118, 4889, 16138, 6272, 140, 2019, 7707, 16138),

(1, 2021, 96, 12710, 1093, 6456, 20355, 5859, 183, 4737, 9577, 20355),

(1, 2022, 96, 13716, 1587, 7560, 22958, 5519, 426, 3248, 13765, 22958),

(1, 2023, 96, 15896, 1933, 7854, 25779, 5770, 1020, 4262, 14728, 25779),

(1, 2024, 96, 18632, 2474, 8698, 29901, 7147, 2698, 4588, 15468, 29901),

(1, 2025, 96, 19304, 2290, 8665, 30355, 9220, 1254, 4725, 15156, 30355),

(1, 2026, 96, 21276, 3929, 9218, 34519, 9640, 1849, 7062, 15968, 34519);

select * from balance_sheet; 	