import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Drum, Music2, Guitar, Music, Piano, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const instruments = [
  { id: "drums", name: "Drums", icon: Drum },
  { id: "bass", name: "Bass", icon: Music2 },
  { id: "electric-guitar", name: "Electric Guitar", icon: Guitar },
  { id: "acoustic-guitar", name: "Acoustic Guitar", icon: Music },
  { id: "piano", name: "Piano", icon: Piano },
];

const singers = [
  { id: "ruby", name: "Ruby", icon: User, gender: "female" },
  { id: "alvaro", name: "Alvaro", icon: User, gender: "male" },
  { id: "anaissa", name: "Anaissa", icon: User, gender: "female" },
  { id: "isaias", name: "Isaias", icon: User, gender: "male" },
  { id: "guti", name: "Guti", icon: User, gender: "male" },
];

export default function RequestGrid() {
  const [, setLocation] = useLocation();

  const handleSelect = (type: string, name: string) => {
    sessionStorage.setItem("selectedType", type);
    sessionStorage.setItem("selectedName", name);
    setLocation("/adjust");
  };

  const handleBack = () => {
    sessionStorage.removeItem("requesterName");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-border">
        <div className="flex items-center px-4 py-3">
          <Button
            data-testid="button-back"
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Select Item</h1>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6">
        <section>
          <h2 className="text-sm uppercase tracking-wide font-semibold text-muted-foreground mb-4">
            Instruments
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {instruments.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  data-testid={`card-instrument-${item.id}`}
                  onClick={() => handleSelect("instrument", item.name)}
                  className="hover-elevate active-elevate-2 cursor-pointer p-6 flex flex-col items-center justify-center space-y-3 min-h-[120px]"
                >
                  <Icon className="h-16 w-16 text-primary" />
                  <span className="text-base font-medium text-center text-foreground">
                    {item.name}
                  </span>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-sm uppercase tracking-wide font-semibold text-muted-foreground mb-4">
            Singers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {singers.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  data-testid={`card-singer-${item.id}`}
                  onClick={() => handleSelect("singer", item.name)}
                  className="hover-elevate active-elevate-2 cursor-pointer p-6 flex flex-col items-center justify-center space-y-3 min-h-[120px]"
                >
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                    item.gender === "female" ? "bg-pink-500/20" : "bg-blue-500/20"
                  }`}>
                    <Icon className={`h-10 w-10 ${
                      item.gender === "female" ? "text-pink-600 dark:text-pink-400" : "text-blue-600 dark:text-blue-400"
                    }`} />
                  </div>
                  <span className="text-base font-medium text-center text-foreground">
                    {item.name}
                  </span>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
