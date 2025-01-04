--simple
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE) VALUES ('Claim', 'Estimator', 'Estimators', 'en_US', 'Estimator1', 'Estimator1');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE) VALUES ('Claim', 'Estimator', 'Estimators', 'en_US', 'Estimator2', 'Estimator2');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE) VALUES ('Claim', 'Estimator', 'Estimators', 'en_US', 'Estimator3', 'Estimator3');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE) VALUES ('Claim', 'Estimator', 'Estimators', 'en_US', 'Estimator4', 'Estimator4');


--dependent
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Western Branch Offices', 'en_US', 'San Francisco', 'San Francisco', 'Region', 'Western');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Western Branch Offices', 'en_US', 'Salt Lake City', 'Salt Lake City', 'Region', 'Western');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Western Branch Offices', 'en_US', 'Seattle', 'Seattle', 'Region', 'Western');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Western Branch Offices', 'en_US', 'Anchorage', 'Anchorage', 'Region', 'Western');

INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Southwest Branch Offices', 'en_US', 'Las Vegas', 'Las Vegas', 'Region', 'Southwest');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Southwest Branch Offices', 'en_US', 'Dallas', 'Dallas', 'Region', 'Southwest');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Southwest Branch Offices', 'en_US', 'Houston', 'Houston', 'Region', 'Southwest');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Southwest Branch Offices', 'en_US', 'Phoenix', 'Phoenix', 'Region', 'Southwest');

INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Midwest Branch Offices', 'en_US', 'Denver', 'Denver', 'Region', 'Midwest');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Midwest Branch Offices', 'en_US', 'Kansas City', 'Kansas City', 'Region', 'Midwest');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Midwest Branch Offices', 'en_US', 'Detroit', 'Detroit', 'Region', 'Midwest');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Midwest Branch Offices', 'en_US', 'St Louis', 'St Louis', 'Region', 'Midwest');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Midwest Branch Offices', 'en_US', 'Cincinnati', 'Cincinnati', 'Region', 'Midwest');

INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Northeast Branch Offices', 'en_US', 'New York City', 'New York City', 'Region', 'Northeast');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Northeast Branch Offices', 'en_US', 'Boston', 'Boston', 'Region', 'Northeast');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Northeast Branch Offices', 'en_US', 'Baltimore', 'Baltimore', 'Region', 'Northeast');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Northeast Branch Offices', 'en_US', 'Philadelphia', 'Philadelphia', 'Region', 'Northeast');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Northeast Branch Offices', 'en_US', 'Williamsburg', 'Williamsburg', 'Region', 'Northeast');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE, DEPON, DEPVALUE) VALUES ('Claim', 'BranchOffice', 'Northeast Branch Offices', 'en_US', 'Washington D.C.', 'Washington D.C.', 'Region', 'Northeast');


--dependent properties
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE) VALUES ('Claim', 'Reason', 'Reasons', 'en_US', 'Accident', 'Accident');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE) VALUES ('Claim', 'Reason', 'Reasons', 'en_US', 'Vandalism', 'Vandalism');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE) VALUES ('Claim', 'Reason', 'Reasons', 'en_US', 'Theft', 'Theft');
INSERT INTO NAVIGATOR.EDS_CHOICES (OBJECTTYPE, PROPERTY, LISTDISPNAME, LANG, DISPNAME, VALUE) VALUES ('Claim', 'Reason', 'Reasons', 'en_US', 'Other', 'Other');