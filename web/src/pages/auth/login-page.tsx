import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { REGISTER_OPTIONS } from "@/lib/app-data";
import { Link } from "react-router";

function LoginPage() {
    return (
        <Card className="border-none bg-transparent pt-0 shadow-none ring-0 outline-none">
            <CardHeader className="border-b border-b-border px-0">
                <CardTitle className="text-xl font-bold">Login</CardTitle>
                <CardDescription className="text-sm">
                    Welcome back! Please enter your credentials to access your
                    account.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-4">
                <div className="flex items-center justify-center">
                    <div className="flex flex-1 gap-8">
                        {REGISTER_OPTIONS.map((option) => (
                            <Button
                                key={option.id}
                                variant="outline"
                                className="flex flex-1 items-center justify-center gap-2 rounded-md"
                            >
                                <img
                                    src={option.icon}
                                    alt={option.name}
                                    className="h-5 w-5"
                                />
                                <span>Login with {option.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="my-8 flex items-center gap-6">
                    <hr className="flex-1 border-0 border-t border-border" />

                    <p className="text-center text-sm text-muted-foreground">
                        Or Continue with Email
                    </p>

                    <hr className="flex-1 border-0 border-t border-border" />
                </div>
                <form>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </Field>
                        <Field>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <a
                                    href="#"
                                    className="ml-auto text-xs underline-offset-2 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" required />
                        </Field>
                    </FieldGroup>
                </form>
                <div className="mt-4 flex items-center justify-end gap-2">
                    <Link to="/auth/register">
                        <Button
                            variant="link"
                            className="text-sm text-muted-foreground underline"
                        >
                            Don't have an account? Register
                        </Button>
                    </Link>
                </div>
            </CardContent>
            <CardFooter className="border-t-0 px-0">
                <Button
                    type="submit"
                    size="lg"
                    className="mx-auto w-full rounded-md text-base"
                >
                    Let's get bidding
                </Button>
            </CardFooter>
        </Card>
    );
}

export default LoginPage;
