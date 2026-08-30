from typing import Dict, Any, List

class DeterministicMetrics:
    def __init__(self):
        self.latency_ms_total = 0
        self.success_count = 0
        self.fallback_count = 0
        self.total = 0
        
    def add_result(self, result: Dict[str, Any]):
        self.total += 1
        
        # Check if AI was successful or fallback
        ai_data = result.get("ai", {})
        if ai_data.get("status") == "success":
            self.success_count += 1
        else:
            self.fallback_count += 1
            
        self.latency_ms_total += ai_data.get("latency_ms", 0)
        
    def get_summary(self) -> Dict[str, Any]:
        if self.total == 0:
            return {}
        return {
            "success_rate": self.success_count / self.total,
            "fallback_rate": self.fallback_count / self.total,
            "avg_latency_ms": self.latency_ms_total / max(1, self.success_count)
        }

class RuleBasedMetrics:
    def __init__(self):
        self.total = 0
        self.valid_schema = 0
        self.has_recommendations = 0
        self.has_topic_interpretation = 0
        
    def add_result(self, result: Dict[str, Any]):
        self.total += 1
        ai_data = result.get("ai", {})
        
        if ai_data.get("status") == "success" and ai_data.get("enhancement"):
            self.valid_schema += 1
            enh = ai_data.get("enhancement", {})
            
            if len(enh.get("optimization_plan", [])) > 0:
                self.has_recommendations += 1
                
            if enh.get("topic_interpretation"):
                self.has_topic_interpretation += 1
                
    def get_summary(self) -> Dict[str, Any]:
        if self.total == 0:
            return {}
        return {
            "schema_validity_rate": self.valid_schema / self.total,
            "has_recommendations_rate": self.has_recommendations / self.total,
            "has_topic_interpretation_rate": self.has_topic_interpretation / self.total
        }
