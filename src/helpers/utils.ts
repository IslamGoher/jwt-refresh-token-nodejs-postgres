export class Utils {
  public static parseCookie(cookie: string) {
    const cookiesObj: {[key: string]: string} = {};
    const cookies = cookie.replace(/ /g, "").split(";");

    cookies.forEach((element) => {
      const splittedElement = element.split("=");
      const key = splittedElement[0];
      const value = splittedElement[1];
      cookiesObj[key] = value;
    });

    return cookiesObj;
  }
}