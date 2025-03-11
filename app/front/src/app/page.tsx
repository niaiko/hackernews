import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
    try{
        redirect("/stories")
        // const res = await fetch("http://BEALYBACK:8080/",  { cache: 'no-store' });
        // const json = await res.json();
        // console.log("====================================")
        // console.log(json.message);
        // console.log("====================================")
        return (
            <main className="container mx-auto px-4 py-8">
              <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
                <div className="flex max-w-[980px] flex-col items-start gap-2">
                  <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    Welcome to Modern HackerNews
                  </h1>
                  <p className="max-w-[700px] text-lg text-muted-foreground">
                    Discover the best tech stories with a redesigned, eye-friendly experience.
                  </p>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Button asChild>
                    <Link href="/stories">Browse Stories</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/profile">My Profile</Link>
                  </Button>
                </div>
              </section>
            </main>
          )
    }
    catch(e){console.log(e);return <div>Error</div>}

    // return (
    //     <div>
    //         <img src="https://cdn.bealy.io/icons/bealyFavicon512.png" alt="Logo" width={50} height={50} />
    //     </div>
    // );
}
