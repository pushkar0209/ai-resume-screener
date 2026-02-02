
class SmartSummarizer:
    @staticmethod
    def generate_summary(candidate_data, job_data, match_details):
        """
        Generates a natural language summary of the match.
        """
        score = match_details['total_score']
        matched = match_details['matched_skills']
        missing = [s for s in job_data.get('required_skills', []) if s.lower() not in [m.lower() for m in matched]]
        
        summary = []
        
        # Opening
        if score > 0.8:
            summary.append(f"Top-tier candidate with a strong {int(score*100)}% match score.")
        elif score > 0.6:
            summary.append(f"Promising candidate with a {int(score*100)}% match.")
        else:
            summary.append(f"Low match probability ({int(score*100)}%). Candidate may not be suitable.")

        # Skills
        if matched:
            skills_str = ", ".join(matched[:3])
            summary.append(f"Bring relevant expertise in {skills_str}.")
        
        if missing:
            missing_str = ", ".join(missing[:3])
            summary.append(f"However, appears to lack specific mention of: {missing_str}.")

        # Semantic verification
        if match_details['semantic_score'] > 0.7:
            summary.append("Contextual analysis suggests strong domain alignment.")
        elif match_details['semantic_score'] < 0.4:
            summary.append("Resume context differs significantly from the job description.")

        return " ".join(summary)
