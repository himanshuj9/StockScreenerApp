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

-- =========================================================
-- SAMPLE NIFTY 50 DATASET
-- All financial/ratio/ownership numbers below are SAMPLE DATA.
-- They are intentionally illustrative and should NOT be treated
-- as real market or company financial data.
-- =========================================================

-- 1. Make sure the financial metrics exist.
INSERT IGNORE INTO metrics (metric_name) VALUES
('Sales'),
('Expenses'),
('Operating Profit'),
('OPM %'),
('Interest'),
('Depreciation'),
('Profit Before Tax');

-- 2. Add the 50-company Nifty 50 sample set.
-- Your existing Tata Motors/Infosys rows are preserved by symbol.
INSERT INTO companies (company_name, symbol) VALUES
('Adani Enterprises Ltd','ADANIENT'),
('Adani Ports and Special Economic Zone Ltd','ADANIPORTS'),
('Apollo Hospitals Enterprise Ltd','APOLLOHOSP'),
('Asian Paints Ltd','ASIANPAINT'),
('Axis Bank Ltd','AXISBANK'),
('Bajaj Auto Ltd','BAJAJ-AUTO'),
('Bajaj Finance Ltd','BAJFINANCE'),
('Bajaj Finserv Ltd','BAJAJFINSV'),
('Bharat Electronics Ltd','BEL'),
('Bharti Airtel Ltd','BHARTIARTL'),
('Cipla Ltd','CIPLA'),
('Coal India Ltd','COALINDIA'),
('Dr. Reddy''s Laboratories Ltd','DRREDDY'),
('Eicher Motors Ltd','EICHERMOT'),
('Eternal Ltd','ETERNAL'),
('Grasim Industries Ltd','GRASIM'),
('HCL Technologies Ltd','HCLTECH'),
('HDFC Bank Ltd','HDFCBANK'),
('HDFC Life Insurance Company Ltd','HDFCLIFE'),
('Hindalco Industries Ltd','HINDALCO'),
('Hindustan Unilever Ltd','HINDUNILVR'),
('ICICI Bank Ltd','ICICIBANK'),
('Infosys Ltd','INFY'),
('InterGlobe Aviation Ltd','INDIGO'),
('ITC Ltd','ITC'),
('Jio Financial Services Ltd','JIOFIN'),
('JSW Steel Ltd','JSWSTEEL'),
('Kotak Mahindra Bank Ltd','KOTAKBANK'),
('Larsen & Toubro Ltd','LT'),
('Mahindra & Mahindra Ltd','M&M'),
('Maruti Suzuki India Ltd','MARUTI'),
('Max Healthcare Institute Ltd','MAXHEALTH'),
('Nestle India Ltd','NESTLEIND'),
('NTPC Ltd','NTPC'),
('Oil & Natural Gas Corporation Ltd','ONGC'),
('Power Grid Corporation of India Ltd','POWERGRID'),
('Reliance Industries Ltd','RELIANCE'),
('SBI Life Insurance Company Ltd','SBILIFE'),
('Shriram Finance Ltd','SHRIRAMFIN'),
('State Bank of India','SBIN'),
('Sun Pharmaceutical Industries Ltd','SUNPHARMA'),
('Tata Consultancy Services Ltd','TCS'),
('Tata Consumer Products Ltd','TATACONSUM'),
('Tata Motors Passenger Vehicles Ltd','TMPV'),
('Tata Steel Ltd','TATASTEEL'),
('Tech Mahindra Ltd','TECHM'),
('Titan Company Ltd','TITAN'),
('Trent Ltd','TRENT'),
('UltraTech Cement Ltd','ULTRACEMCO'),
('Wipro Ltd','WIPRO')
ON DUPLICATE KEY UPDATE company_name = VALUES(company_name);

-- 3. Balance-sheet table.
-- Run this only if you have not already created it.
CREATE TABLE IF NOT EXISTS balance_sheet (
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

-- 4. Financial results:
-- 2024 annual + Q1-Q4 2025 for all 50 companies.
INSERT IGNORE INTO financial_results
(company_id, metric_id, year, quarter, value)
SELECT
    c.company_id,
    m.metric_id,
    d.year,
    d.quarter,
    CASE m.metric_name
        WHEN 'Sales' THEN 5000 + c.company_id * 125 + d.quarter * 80
        WHEN 'Expenses' THEN 3600 + c.company_id * 90 + d.quarter * 60
        WHEN 'Operating Profit' THEN 1400 + c.company_id * 35 + d.quarter * 20
        WHEN 'OPM %' THEN 18 + MOD(c.company_id, 15)
        WHEN 'Interest' THEN 100 + c.company_id * 4 + d.quarter * 3
        WHEN 'Depreciation' THEN 150 + c.company_id * 5 + d.quarter * 4
        WHEN 'Profit Before Tax' THEN 1050 + c.company_id * 28 + d.quarter * 15
    END
FROM companies c
CROSS JOIN metrics m
CROSS JOIN (
    SELECT 2024 AS year, 0 AS quarter
    UNION ALL SELECT 2025, 1
    UNION ALL SELECT 2025, 2
    UNION ALL SELECT 2025, 3
    UNION ALL SELECT 2025, 4
) d
WHERE c.symbol IN ('ADANIENT','ADANIPORTS','APOLLOHOSP','ASIANPAINT','AXISBANK','BAJAJ-AUTO','BAJFINANCE','BAJAJFINSV','BEL','BHARTIARTL','CIPLA','COALINDIA','DRREDDY','EICHERMOT','ETERNAL','GRASIM','HCLTECH','HDFCBANK','HDFCLIFE','HINDALCO','HINDUNILVR','ICICIBANK','INFY','INDIGO','ITC','JIOFIN','JSWSTEEL','KOTAKBANK','LT','M&M','MARUTI','MAXHEALTH','NESTLEIND','NTPC','ONGC','POWERGRID','RELIANCE','SBILIFE','SHRIRAMFIN','SBIN','SUNPHARMA','TCS','TATACONSUM','TMPV','TATASTEEL','TECHM','TITAN','TRENT','ULTRACEMCO','WIPRO')
AND m.metric_name IN (
    'Sales','Expenses','Operating Profit','OPM %',
    'Interest','Depreciation','Profit Before Tax'
);

-- 5. Ratios:
-- 11 sample ratios for every company for 2026.
INSERT IGNORE INTO ratios (company_id, ratio_name, year, value)
SELECT
    c.company_id,
    r.ratio_name,
    2026,
    CASE r.ratio_name
        WHEN 'Market Cap' THEN 50000 + c.company_id * 3500
        WHEN 'Current Price' THEN 500 + c.company_id * 45
        WHEN 'Stock PE' THEN 15 + MOD(c.company_id, 35)
        WHEN 'Book Value' THEN 100 + c.company_id * 8
        WHEN 'Dividend Yield' THEN 0.50 + MOD(c.company_id, 20) * 0.10
        WHEN 'ROCE' THEN 10 + MOD(c.company_id, 20) * 0.8
        WHEN 'ROE' THEN 8 + MOD(c.company_id, 18) * 0.9
        WHEN 'EPS' THEN 20 + c.company_id * 3
        WHEN 'Price to Book' THEN 2 + MOD(c.company_id, 12) * 0.5
        WHEN 'Debt to Equity' THEN 0.10 + MOD(c.company_id, 12) * 0.08
        WHEN 'PEG Ratio' THEN 0.80 + MOD(c.company_id, 20) * 0.20
    END
FROM companies c
CROSS JOIN (
    SELECT 'Market Cap' AS ratio_name
    UNION ALL SELECT 'Current Price'
    UNION ALL SELECT 'Stock PE'
    UNION ALL SELECT 'Book Value'
    UNION ALL SELECT 'Dividend Yield'
    UNION ALL SELECT 'ROCE'
    UNION ALL SELECT 'ROE'
    UNION ALL SELECT 'EPS'
    UNION ALL SELECT 'Price to Book'
    UNION ALL SELECT 'Debt to Equity'
    UNION ALL SELECT 'PEG Ratio'
) r
WHERE c.symbol IN ('ADANIENT','ADANIPORTS','APOLLOHOSP','ASIANPAINT','AXISBANK','BAJAJ-AUTO','BAJFINANCE','BAJAJFINSV','BEL','BHARTIARTL','CIPLA','COALINDIA','DRREDDY','EICHERMOT','ETERNAL','GRASIM','HCLTECH','HDFCBANK','HDFCLIFE','HINDALCO','HINDUNILVR','ICICIBANK','INFY','INDIGO','ITC','JIOFIN','JSWSTEEL','KOTAKBANK','LT','M&M','MARUTI','MAXHEALTH','NESTLEIND','NTPC','ONGC','POWERGRID','RELIANCE','SBILIFE','SHRIRAMFIN','SBIN','SUNPHARMA','TCS','TATACONSUM','TMPV','TATASTEEL','TECHM','TITAN','TRENT','ULTRACEMCO','WIPRO');

-- 6. Company information:
-- One profile and key-points entry for every company.
INSERT INTO company_information (company_id, about, key_points)
SELECT
    c.company_id,
    CONCAT(
        c.company_name,
        ' is a sample company profile created for the stock screener project. ',
        'It operates across its core business segments and is included in the Nifty 50 sample dataset.'
    ),
    CONCAT(
        'Key Points:\\n',
        '1. Nifty 50 constituent in this sample dataset.\\n',
        '2. Sample business profile for demonstrating the stock screener UI.\\n',
        '3. Financial and ownership figures in this dataset are illustrative only.'
    )
FROM companies c
WHERE c.symbol IN ('ADANIENT','ADANIPORTS','APOLLOHOSP','ASIANPAINT','AXISBANK','BAJAJ-AUTO','BAJFINANCE','BAJAJFINSV','BEL','BHARTIARTL','CIPLA','COALINDIA','DRREDDY','EICHERMOT','ETERNAL','GRASIM','HCLTECH','HDFCBANK','HDFCLIFE','HINDALCO','HINDUNILVR','ICICIBANK','INFY','INDIGO','ITC','JIOFIN','JSWSTEEL','KOTAKBANK','LT','M&M','MARUTI','MAXHEALTH','NESTLEIND','NTPC','ONGC','POWERGRID','RELIANCE','SBILIFE','SHRIRAMFIN','SBIN','SUNPHARMA','TCS','TATACONSUM','TMPV','TATASTEEL','TECHM','TITAN','TRENT','ULTRACEMCO','WIPRO')
ON DUPLICATE KEY UPDATE
    about = VALUES(about),
    key_points = VALUES(key_points);

-- 7. Shareholding pattern:
-- Four quarters of sample data for 2025.
INSERT IGNORE INTO shareholding_pattern
(company_id, year, quarter,
 promoter_shareholding, fii_shareholding, dii_shareholding,
 public_shareholding, others_shareholding, shareholders_count)
SELECT
    c.company_id,
    2025,
    q.quarter,
    ROUND(40 + MOD(c.company_id, 15) * 0.8, 2),
    ROUND(15 + MOD(c.company_id, 12) * 0.55 + q.quarter * 0.20, 2),
    ROUND(12 + MOD(c.company_id, 10) * 0.60 + q.quarter * 0.15, 2),
    ROUND(
        100
        - (40 + MOD(c.company_id, 15) * 0.8)
        - (15 + MOD(c.company_id, 12) * 0.55 + q.quarter * 0.20)
        - (12 + MOD(c.company_id, 10) * 0.60 + q.quarter * 0.15)
        - 0.10,
        2
    ),
    0.10,
    500000 + c.company_id * 12500 + q.quarter * 5000
FROM companies c
CROSS JOIN (
    SELECT 1 AS quarter
    UNION ALL SELECT 2
    UNION ALL SELECT 3
    UNION ALL SELECT 4
) q
WHERE c.symbol IN ('ADANIENT','ADANIPORTS','APOLLOHOSP','ASIANPAINT','AXISBANK','BAJAJ-AUTO','BAJFINANCE','BAJAJFINSV','BEL','BHARTIARTL','CIPLA','COALINDIA','DRREDDY','EICHERMOT','ETERNAL','GRASIM','HCLTECH','HDFCBANK','HDFCLIFE','HINDALCO','HINDUNILVR','ICICIBANK','INFY','INDIGO','ITC','JIOFIN','JSWSTEEL','KOTAKBANK','LT','M&M','MARUTI','MAXHEALTH','NESTLEIND','NTPC','ONGC','POWERGRID','RELIANCE','SBILIFE','SHRIRAMFIN','SBIN','SUNPHARMA','TCS','TATACONSUM','TMPV','TATASTEEL','TECHM','TITAN','TRENT','ULTRACEMCO','WIPRO');

-- 8. Balance sheet:
-- Annual sample data for 2023, 2024 and 2025.
INSERT IGNORE INTO balance_sheet
(company_id, year, equity_capital, reserves, borrowings,
 other_liabilities, total_liabilities,
 fixed_assets, cwip, investments, other_assets, total_assets)
SELECT
    c.company_id,
    y.year,
    50 + c.company_id * 2,
    5000 + c.company_id * 250 + (y.year - 2023) * 500,
    1500 + c.company_id * 80 + (y.year - 2023) * 120,
    3000 + c.company_id * 120 + (y.year - 2023) * 250,
    9550 + c.company_id * 452 + (y.year - 2023) * 870,
    3500 + c.company_id * 130 + (y.year - 2023) * 300,
    500 + c.company_id * 30 + (y.year - 2023) * 70,
    1500 + c.company_id * 70 + (y.year - 2023) * 150,
    4050 + c.company_id * 222 + (y.year - 2023) * 350,
    9550 + c.company_id * 452 + (y.year - 2023) * 870
FROM companies c
CROSS JOIN (
    SELECT 2023 AS year
    UNION ALL SELECT 2024
    UNION ALL SELECT 2025
) y
WHERE c.symbol IN ('ADANIENT','ADANIPORTS','APOLLOHOSP','ASIANPAINT','AXISBANK','BAJAJ-AUTO','BAJFINANCE','BAJAJFINSV','BEL','BHARTIARTL','CIPLA','COALINDIA','DRREDDY','EICHERMOT','ETERNAL','GRASIM','HCLTECH','HDFCBANK','HDFCLIFE','HINDALCO','HINDUNILVR','ICICIBANK','INFY','INDIGO','ITC','JIOFIN','JSWSTEEL','KOTAKBANK','LT','M&M','MARUTI','MAXHEALTH','NESTLEIND','NTPC','ONGC','POWERGRID','RELIANCE','SBILIFE','SHRIRAMFIN','SBIN','SUNPHARMA','TCS','TATACONSUM','TMPV','TATASTEEL','TECHM','TITAN','TRENT','ULTRACEMCO','WIPRO');

-- =========================================================
-- 9. VERIFICATION QUERIES
-- =========================================================

SELECT COUNT(*) AS total_companies
FROM companies;

SELECT COUNT(*) AS total_metrics
FROM metrics;

SELECT COUNT(*) AS total_financial_rows
FROM financial_results;

SELECT COUNT(*) AS total_ratio_rows
FROM ratios;

SELECT COUNT(*) AS total_company_information_rows
FROM company_information;

SELECT COUNT(*) AS total_shareholding_rows
FROM shareholding_pattern;

SELECT COUNT(*) AS total_balance_sheet_rows
FROM balance_sheet;

-- Check the 50 companies:
SELECT company_id, company_name, symbol
FROM companies
WHERE symbol IN ('ADANIENT','ADANIPORTS','APOLLOHOSP','ASIANPAINT','AXISBANK','BAJAJ-AUTO','BAJFINANCE','BAJAJFINSV','BEL','BHARTIARTL','CIPLA','COALINDIA','DRREDDY','EICHERMOT','ETERNAL','GRASIM','HCLTECH','HDFCBANK','HDFCLIFE','HINDALCO','HINDUNILVR','ICICIBANK','INFY','INDIGO','ITC','JIOFIN','JSWSTEEL','KOTAKBANK','LT','M&M','MARUTI','MAXHEALTH','NESTLEIND','NTPC','ONGC','POWERGRID','RELIANCE','SBILIFE','SHRIRAMFIN','SBIN','SUNPHARMA','TCS','TATACONSUM','TMPV','TATASTEEL','TECHM','TITAN','TRENT','ULTRACEMCO','WIPRO')
ORDER BY company_id;

select * from financial_results;
select * from companies;
select * from company_information;