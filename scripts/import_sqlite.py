#!/usr/bin/env python3
"""Export only the safe, public prediction fields from a private tracking DB.
Usage: python3 scripts/import_sqlite.py /path/to/private.sqlite
The private SQLite file should never be uploaded to a public repo.
"""
import sys, json, pathlib, sqlite3
if len(sys.argv)!=2: raise SystemExit('Usage: python3 scripts/import_sqlite.py /path/to/private.sqlite')
db=pathlib.Path(sys.argv[1]); root=pathlib.Path(__file__).resolve().parents[1]
fields=['id','match_date','kick_off_local','timezone','competition','home_team','away_team','market','selection','selected_team','decimal_odds','model_probability','ev_pct','threshold_exception','status','final_home_goals','final_away_goals','net_units','evidence_url','saved_at_local']
with sqlite3.connect(db) as c:
 c.row_factory=sqlite3.Row
 rows=[{k:row[k] for k in fields} for row in c.execute('SELECT * FROM predictions ORDER BY match_date DESC,kick_off_local')]
for p in rows:
 assert p['market']=='1X2' and p['selection'] in {'1','X','2'}
 assert p['decimal_odds']>=1 and 0<=p['model_probability']<=1
path=root/'data'/'predictions.json';path.write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(f'Wrote {len(rows)} public records to {path}; never commit the original private database.')
