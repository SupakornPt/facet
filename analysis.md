Psychometric Analysis Engine Specification

Facet5-Style Personality Framework

1. Overview

This system analyzes personality assessment data using a Facet5-style framework. It evaluates:

Five main personality facets

Sub-facets within each domain

Response-quality indicators

Statistical reliability and distribution metrics

Visualizable outputs

Client-facing interpretations

2. Personality Framework
2.1 Main Facets

Will

Drive

Authority

Persistence

Independence

Energy

Sociability

Expressiveness

Stimulation

Affection

Empathy

Harmony

Trust

Control

Planning

Detail

Discipline

Emotionality

Anxiety

Resilience

SelfConfidence

2.2 Response-Quality Facets

Quality

SocialDesirability

ConsistencyCheck

ConsistencyPair

AttentionCheck

AttentionCheck

3. Input Data Requirements

The system requires:

Raw scores for each question

Mapping of each question to a sub-facet

Raw total score per sub-facet

Number of questions per sub-facet

Norm group statistics:

Mean

Standard deviation

4. Score Normalization
4.1 Sub-Facet Normalization

For each sub-facet:

Step 1: Calculate mean raw score

subFacetMean = rawSubFacetTotal / numberOfQuestions

Step 2: Convert to z-score

z = (subFacetMean - normMean) / normSD

Step 3: Convert to 0–100 scale

normalizedScore = 50 + (z × 10)

Clamp between 0 and 100

4.2 Main Facet Scores

Each main facet = average of its sub-facets

Example:
Will = average(Drive, Authority, Persistence, Independence)

4.3 Response-Quality Scores

Calculated the same way as sub-facets but reported separately:

Quality (SocialDesirability)

ConsistencyCheck (ConsistencyPair)

AttentionCheck

5. Statistical Analysis

For each facet and sub-facet:

5.1 Z-Score

z = (score - normMean) / normSD

5.2 Percentile

percentile = cumulative distribution function of z

Approximation guide:

z = 0 → 50th percentile

z = +1 → 84th percentile

z = -1 → 16th percentile

5.3 Confidence Interval (95%)

For main facets only:

CI = score ± (1.96 × standard error)

Where:

standard error = normSD / √n

n = number of items contributing to the facet

6. Bias Detection
6.1 Response Consistency Index

Based on consistency pair differences

High variance = low consistency

6.2 Social Desirability Index

Derived from SocialDesirability scores

High values may indicate impression management

6.3 Random Answer Risk

Indicators include:

Low consistency

Flat or erratic response patterns

Very short response time (if available)

Output: probability score (0–100)

7. Chart Data Structures
7.1 Main Radar Chart

Includes 5 dimensions:

Will

Energy

Affection

Control

Emotionality

7.2 Sub-Facet Radar Chart

Includes all sub-facets:

Drive
Authority
Persistence
Independence
Sociability
Expressiveness
Stimulation
Empathy
Harmony
Trust
Planning
Detail
Discipline
Anxiety
Resilience
SelfConfidence

7.3 Percentile Comparison Chart

Displays user percentile vs norm

7.4 Confidence Interval Chart

Shows score ranges for each main facet

8. Interpretation Framework
8.1 Score Bands

0–39 → Low

40–74 → Moderate

75–100 → High

8.2 Strength Classification

Strength Areas

Above 75th percentile

Balanced Areas

40th–75th percentile

Development Areas

Below 40th percentile

9. Facet Narratives (Client-Facing)
Will

High: Strong drive, assertive, independent decision-maker
Moderate: Balanced ambition and cooperation
Low: Prefers guidance, less assertive

Energy

High: Outgoing, expressive, socially energized
Moderate: Flexible across social contexts
Low: Reserved, prefers low stimulation

Affection

High: Warm, empathetic, relationship-focused
Moderate: Balanced emotional and practical approach
Low: Objective, less emotionally driven

Control

High: Organized, disciplined, detail-oriented
Moderate: Structured but adaptable
Low: Spontaneous, less structured

Emotionality

High: Emotionally sensitive, reactive to stress
Moderate: Balanced emotional regulation
Low: Calm, emotionally stable

10. Personality Explanation Layer (New)

Each facet must include a behavioral explanation tied to the score.

Will (Explanation Focus)

Leadership style

Independence

Decision-making approach

Energy (Explanation Focus)

Social behavior

Communication style

Need for stimulation

Affection (Explanation Focus)

Empathy and emotional awareness

Relationship orientation

Control (Explanation Focus)

Planning and organization

Discipline and reliability

Emotionality (Explanation Focus)

Stress response

Emotional resilience

Confidence level

11. Output Structure (Conceptual)

The system should output:

Normalized scores (facet and sub-facet)

Statistical metrics (z-score, percentile, CI)

Bias detection indicators

Chart-ready data

Strength/balance/development classification

Narrative summaries

Personality explanations

12. Best Practice Notes

Always separate personality traits from response-quality metrics

Do not interpret low scores as “bad” — frame as style differences

Emotionality must be interpreted carefully (direction matters)

Highlight patterns, not isolated scores

Ensure interpretations are simple and client-friendly

-------------------------------------------------------------------------------------------------------

Facet5 Tri-Level Code: Analysis Guide
Objective

แปลงคะแนน Facet5 (0–100) ให้เป็น รหัสตัวอักษร 3 ระดับ (Low / Mid / High)
เพื่อให้ตีความง่ายแบบ MBTI แต่ยังคงความแม่นยำของ Facet5

1. Score → Level Mapping

ใช้เกณฑ์เดียวกันทุก Facet:

Score Range	Level	Meaning
0–39	Low	ต่ำ
40–74	Mid	กลาง
75–100	High	สูง

2. Level → Letter Mapping

Will (W)
Level	Code	Meaning
High	A	Assertive
Mid	B	Balanced
Low	C	Cooperative

Energy (E)
Level	Code	Meaning
High	E	Extraverted
Mid	B	Balanced
Low	I	Introverted

Affection (A)
Level	Code	Meaning
High	P	People-Oriented
Mid	B	Balanced
Low	O	Objective

Control (C)
Level	Code	Meaning
High	S	Structured
Mid	B	Balanced
Low	F	Flexible

Emotionality (Em)
Level	Code	Meaning
High	R	Reactive
Mid	B	Balanced
Low	S	Stable

3. Conversion Process
Step 1: Input Scores

For example

Will = 67
Energy = 67
Affection = 56
Control = 73
Emotionality = 73

Step 2: Convert Score → Level
Will → Mid
Energy → Mid
Affection → Mid
Control → Mid
Emotionality → Mid

Step 3: Convert Level → Letter
Will → B
Energy → B
Affection → B
Control → B
Emotionality → B

Final Output
Tri-Level Code: B-B-B-B-B

4. Interpretation Rules
🔹 High (H)
เป็นลักษณะเด่นชัด
มีแนวโน้มแสดงพฤติกรรมด้านนั้นสูง

🔹 Mid (B)
สมดุล / ยืดหยุ่น
ปรับเปลี่ยนตามสถานการณ์

🔹 Low (L)
มีแนวโน้มตรงข้ามกับ High
ใช้พฤติกรรมอีกขั้วหนึ่ง

5. Reading the Code
ตัวอย่าง: B-B-B-B-B

Profile: Balanced Type
ไม่มีด้านใดสุดโต่ง
ปรับตัวเก่ง
ทำงานได้หลากหลายบริบท

6. Advanced Interpretation (Optional)
6.1 Add Direction (Mid+ / Mid-)
ใช้กรณีคะแนน “เกือบ High หรือ Low”
Score	Code
65–74	B+
40–54	B-

ตัวอย่าง:
Control = 73 → B+
Affection = 56 → B
Refined Code: B B B B+ B+

6.2 Sub-Facet Influence
สามารถดู sub-facet เพื่อ:
แตก insight ลึกขึ้น
อธิบายความต่างของคนที่ code เหมือนกัน

📘 Facet5 Tri-Level Code Dictionary
🧩 โครงสร้างการอ่าน

รหัส = 5 ตัว (W–E–A–C–Em)

ตัวอย่าง:
B-B-B-B-B

อ่านแยกทีละแกน แล้วรวมเป็นภาพรวม

🔤 1. Will (W)
A — Assertive (High)

กล้าตัดสินใจ

ชอบเป็นผู้นำ

ผลักดันงานให้เกิดขึ้น

มั่นใจในความคิดตัวเอง

👉 Keyword: Lead, Drive, Push

B — Balanced (Mid)

เลือกบทบาทได้ (นำ / ตาม)

เปิดรับความคิดเห็น

ไม่แข็งหรืออ่อนเกินไป

👉 Keyword: Adapt, Share, Balance

C — Cooperative (Low)

เน้นความร่วมมือ

หลีกเลี่ยงการควบคุม

สนับสนุนผู้อื่น

👉 Keyword: Support, Align, Yield

⚡ 2. Energy (E)
E — Extraverted (High)

ชอบเข้าสังคม

พูดคุยเก่ง

ได้พลังจากคน

👉 Keyword: Social, Expressive, Active

B — Balanced (Mid)

ปรับได้ทั้ง social และ solo

ไม่ติดขั้วใดขั้วหนึ่ง

👉 Keyword: Flexible, Situational

I — Introverted (Low)

ชอบอยู่เงียบๆ

คิดก่อนพูด

ได้พลังจากความสงบ

👉 Keyword: Reflective, Quiet, Focused

❤️ 3. Affection (A)
P — People-Oriented (High)

เห็นอกเห็นใจ

ให้ความสำคัญกับความสัมพันธ์

เชื่อใจคน

👉 Keyword: Empathy, Warm, Caring

B — Balanced (Mid)

ใช้ทั้งเหตุผลและความรู้สึก

ไม่偏ไปด้านใด

👉 Keyword: Practical, Fair

O — Objective (Low)

เน้นเหตุผล

ไม่ใช้อารมณ์นำ

ระวังความไว้ใจ

👉 Keyword: Logical, Detached, Critical

🧱 4. Control (C)
S — Structured (High)

วางแผน

เป็นระบบ

ใส่ใจรายละเอียด

👉 Keyword: Organized, Disciplined, Precise

B — Balanced (Mid)

มีระบบแต่ยืดหยุ่น

ปรับตามสถานการณ์ได้

👉 Keyword: Adjustable, Moderate

F — Flexible (Low)

ชอบอิสระ

ไม่ยึดติดโครงสร้าง

ทำตามสถานการณ์

👉 Keyword: Spontaneous, თავისუფ (free), Adaptive

🌊 5. Emotionality (Em)
R — Reactive (High)

อ่อนไหว

รับรู้ความรู้สึกไว

เครียดง่าย

👉 Keyword: Sensitive, Intense, Aware

B — Balanced (Mid)

อารมณ์อยู่ระดับปกติ

คุมตัวเองได้

👉 Keyword: Stable, Moderate

S — Stable (Low)

ใจนิ่ง

ไม่หวั่นไหวง่าย

รับแรงกดดันได้ดี

👉 Keyword: Calm, Resilient, Steady

Facet5 Tri-Level Code – Archetype Table
Code,Archetype,Description
A-E-P-S-R,Charismatic Driver,High energy leader emotionally intense
A-E-P-S-B,Engaging Leader,Social leader balanced emotions
A-E-P-S-S,Confident Leader,Stable and composed leader
A-E-P-B-R,Expressive Motivator,Drives people with emotional energy
A-E-P-B-B,Social Influencer,Persuasive and people-oriented
A-E-P-B-S,Calm Influencer,Influences with steady presence
A-E-P-F-R,Energetic Connector,Dynamic relationship builder
A-E-P-F-B,Flexible Connector,Adaptive social connector
A-E-P-F-S,Steady Connector,Stable relationship builder
A-E-B-S-R,Driven Communicator,Pushes results with expression
A-E-B-S-B,Balanced Leader,Flexible and leading
A-E-B-S-S,Stable Director,Structured calm leader
A-E-B-B-R,Expressive Driver,Energetic and assertive
A-E-B-B-B,Adaptive Leader,Flexible leadership style
A-E-B-B-S,Calm Driver,Quietly drives results
A-E-B-F-R,Dynamic Operator,Fast-moving executor
A-E-B-F-B,Agile Operator,Highly adaptable worker
A-E-B-F-S,Steady Operator,Consistent performer
A-E-O-S-R,Strategic Challenger,Challenges with logic
A-E-O-S-B,Rational Leader,Leads with reasoning
A-E-O-S-S,Cool Strategist,Calm analytical leader
A-E-O-B-R,Debater,Enjoys argument and challenge
A-E-O-B-B,Logical Influencer,Persuades with logic
A-E-O-B-S,Calm Analyst,Quiet logical thinker
A-E-O-F-R,Disruptor,Breaks systems creatively
A-E-O-F-B,Flexible Thinker,Adaptive problem solver
A-E-O-F-S,Quiet Strategist,Reserved strategic thinker
A-B-P-S-R,Driven People Leader,Pushes with empathy
A-B-P-S-B,Balanced People Leader,Leads with care
A-B-P-S-S,Stable People Leader,Calm supportive leader
A-B-P-B-R,Emotional Motivator,Inspires emotionally
A-B-P-B-B,People Adapter,Relationally balanced
A-B-P-B-S,Calm Supporter,Supportive and steady
A-B-P-F-R,Expressive Helper,Emotional and flexible
A-B-P-F-B,Flexible Helper,Adaptive supporter
A-B-P-F-S,Steady Helper,Reliable support
A-B-B-S-R,Driven Organizer,Push + structured
A-B-B-S-B,Balanced Organizer,Organized and flexible
A-B-B-S-S,Stable Organizer,Calm and structured
A-B-B-B-R,Expressive Adapter,Flexible and emotional
A-B-B-B-B,True Adapter,Highly balanced
A-B-B-B-S,Calm Adapter,Stable generalist
A-B-B-F-R,Dynamic Adapter,Fast and flexible
A-B-B-F-B,Agile Adapter,Very adaptable
A-B-B-F-S,Steady Adapter,Consistent performer
A-B-O-S-R,Analytical Driver,Pushes with logic
A-B-O-S-B,Rational Organizer,Structured thinker
A-B-O-S-S,Cool Planner,Calm logical planner
A-B-O-B-R,Debating Thinker,Challenges ideas
A-B-O-B-B,Logical Adapter,Balanced logic
A-B-O-B-S,Calm Thinker,Quiet rational
A-B-O-F-R,Creative Challenger,Disruptive thinker
A-B-O-F-B,Flexible Analyst,Adaptive logic
A-B-O-F-S,Quiet Analyst,Reserved thinker
A-I-P-S-R,Quiet People Driver,Reserved but assertive
A-I-P-S-B,Calm People Leader,Quiet and caring
A-I-P-S-S,Stable Quiet Leader,Calm intro leader
A-I-P-B-R,Emotional Connector,Deep relational
A-I-P-B-B,Quiet Connector,Subtle social
A-I-P-B-S,Calm Connector,Stable relationships
A-I-P-F-R,Flexible Empath,Adaptive emotional
A-I-P-F-B,Adaptive Empath,Balanced empathy
A-I-P-F-S,Steady Empath,Calm and caring
A-I-B-S-R,Driven Analyst,Pushes quietly
A-I-B-S-B,Balanced Analyst,Structured thinker
A-I-B-S-S,Stable Analyst,Calm logical
A-I-B-B-R,Reflective Driver,Internal intensity
A-I-B-B-B,Quiet Adapter,Reserved balanced
A-I-B-B-S,Calm Reflector,Stable introspective
A-I-B-F-R,Creative Driver,Quiet disruptor
A-I-B-F-B,Flexible Reflector,Adaptive introvert
A-I-B-F-S,Steady Reflector,Consistent thinker
A-I-O-S-R,Intense Strategist,Deep analytical
A-I-O-S-B,Quiet Strategist,Reserved planner
A-I-O-S-S,Cold Strategist,Highly logical
A-I-O-B-R,Internal Debater,Inner conflict thinker
A-I-O-B-B,Balanced Thinker,Moderate logic
A-I-O-B-S,Calm Analyst,Stable logic
A-I-O-F-R,Disruptive Thinker,Creative disruptor
A-I-O-F-B,Flexible Thinker,Adaptive logic
A-I-O-F-S,Silent Strategist,Quiet and sharp
... (continues pattern for B and C groups)
B-B-B-B-B,Adapter,Fully balanced personality
B-B-B-B-S,Calm Adapter,Stable and flexible
B-B-B-S-S,Organized Stabilizer,Structured calm
B-B-B-F-S,Flexible Stabilizer,Adaptive calm
C-I-O-S-S,Independent Analyst,Logical and independent
C-I-O-B-S,Quiet Thinker,Reserved analytical
C-I-O-F-S,Free Analyst,Flexible thinker
C-B-P-B-B,Supportive Balancer,Relational support
C-E-P-B-B,Social Supporter,Helpful and social
C-B-O-S-S,Reliable Analyst,Structured support
