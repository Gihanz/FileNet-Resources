INSERT INTO NAVIGATOR.EDS (OBJECTTYPE, PROPERTY) VALUES ('Claim', 'BranchOffice');
INSERT INTO NAVIGATOR.EDS (OBJECTTYPE, PROPERTY) VALUES ('Claim', 'Estimator');
INSERT INTO NAVIGATOR.EDS (OBJECTTYPE, PROPERTY, FORMAT, FORMATDESC) VALUES ('Claim', 'ClaimNumber', '\d\d-\d\d\d\d\d', 'nn-nnnnn');
INSERT INTO NAVIGATOR.EDS (OBJECTTYPE, PROPERTY, HASDEPENDANT) VALUES ('Claim', 'Reason', '1');
INSERT INTO NAVIGATOR.EDS (OBJECTTYPE, PROPERTY, MAXVAL, MINVAL) VALUES ('Claim', 'AdjustedLoss', 12000, 0);
INSERT INTO NAVIGATOR.EDS (OBJECTTYPE, PROPERTY, HASDEPENDANT) VALUES ('Claim', 'Region', '1');
