import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const topics = [
  {
    title: "Threat Detection",
    description: "Advanced techniques for identifying and analyzing security threats in real-time",
    color: "from-primary to-secondary"
  },
  {
    title: "Security Monitoring",
    description: "Continuous surveillance and analysis of network traffic and system activities",
    color: "from-secondary to-primary"
  },
  {
    title: "Incident Response",
    description: "Structured approaches to handling and recovering from security incidents",
    color: "from-primary to-accent"
  },
  {
    title: "Log Analysis",
    description: "Deep dive into security logs to uncover anomalies and potential threats",
    color: "from-accent to-secondary"
  },
  {
    title: "Access Control",
    description: "Implementing robust authentication and authorization mechanisms",
    color: "from-secondary to-accent"
  },
  {
    title: "SIEM Solutions",
    description: "Security Information and Event Management best practices and tools",
    color: "from-accent to-primary"
  }
];

const Topics = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 circuit-pattern opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Blue Team Topics</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coverage of defensive cybersecurity concepts and practices
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <Card 
                key={index} 
                className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all duration-500 group cursor-pointer relative overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Animated background gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                {/* Shimmer effect on hover */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" 
                       style={{ backgroundSize: '200% 100%' }} />
                )}
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-xl gradient-text group-hover:scale-105 transition-transform duration-300 inline-block">
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {topic.description}
                  </CardDescription>
                </CardContent>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Topics;
