import { Building, Globe, ArrowRight, Users, Vote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface LevelSelectionScreenProps {
  onSelectLevel: (level: 'national' | 'branch') => void;
}

export function LevelSelectionScreen({ onSelectLevel }: LevelSelectionScreenProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Vote className="h-4 w-4" />
            <span className="text-sm font-medium">Welcome, {user?.name?.split(' ')[0]}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Choose Your Voting Level
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Select the election level you'd like to participate in. You can switch between levels anytime from the dashboard.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* National Level Card */}
          <Card 
            className="group cursor-pointer border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
            onClick={() => onSelectLevel('national')}
          >
            <CardContent className="p-0">
              <div className="p-6 md:p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-primary-foreground" />
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  National Elections
                </h2>
                <p className="text-muted-foreground mb-6">
                  Vote for national leadership positions that represent all KMPDU members across Kenya.
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>All Members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="h-4 w-4" />
                    <span>Nationwide</span>
                  </div>
                </div>

                <Button className="w-full group-hover:bg-primary transition-colors">
                  Enter National Elections
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              {/* Decorative gradient */}
              <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
            </CardContent>
          </Card>

          {/* Branch Level Card */}
          <Card 
            className="group cursor-pointer border-2 border-border hover:border-accent transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 overflow-hidden"
            onClick={() => onSelectLevel('branch')}
          >
            <CardContent className="p-0">
              <div className="p-6 md:p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-8 w-8 text-accent-foreground" />
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Branch Elections
                </h2>
                <p className="text-muted-foreground mb-6">
                  Vote for leadership positions specific to your branch: <span className="font-medium text-foreground">{user?.branch}</span>
                </p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>Branch Members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="h-4 w-4" />
                    <span>{user?.branch}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
                  Enter Branch Elections
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              {/* Decorative gradient */}
              <div className="h-1.5 bg-gradient-to-r from-accent via-accent/60 to-transparent" />
            </CardContent>
          </Card>
        </div>

        {/* Footer hint */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          You can switch between National and Branch elections anytime from the sidebar
        </p>
      </div>
    </div>
  );
}
