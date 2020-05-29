using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using circle_competitions_monitoring.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace circle_competitions_monitoring.Controllers
{
    public class AccountController : Controller
    {
        private DataContext db;
        public AccountController(DataContext context)
        {
            this.db = context;
        }

        [Authorize]
        [HttpPost]
        public User GetUser()
        {
            User user = db.User.FirstOrDefault(u => u.id == int.Parse(User.Identity.Name));
            return user;
        }

        [HttpPost]
        public async Task Authorize([FromBody]LoginForm form)
        {
            ClaimsIdentity identity = GetIdentity(form.login, form.password);
            if (identity == null)
            {
                Response.StatusCode = 400;
                return;
            }
            else
            {
                DateTime now = DateTime.UtcNow;
                JwtSecurityToken jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
                var response = new
                {
                    access_token = encodedJwt,
                    User = db.User.FirstOrDefault(u => u.id == Convert.ToInt32(identity.Name))
                };
                Response.ContentType = "application/json";
                await Response.WriteAsync(
                    JsonConvert.SerializeObject(
                        response,
                        new JsonSerializerSettings
                        {
                            Formatting = Formatting.Indented
                        })
                );
            }
        }

        [HttpPost]
        public async Task Registrate([FromBody] User user)
        {
            ICollection<User> users = db.User.ToList();
            User checkUser = users.FirstOrDefault(u => u.login == user.login);
            if (checkUser != null)
            {
                Response.StatusCode = 400;
                return;
            }
            db.User.Add(user);
            db.SaveChanges();
            var identity = NewIdentity(user);
            var now = DateTime.Now;
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                notBefore: now,
                claims: identity.Claims,
                expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
            );
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            var response = new
            {
                access_token = encodedJwt,
                user = user
            };
            Response.ContentType = "application/json";
            await Response.WriteAsync(
                JsonConvert.SerializeObject(response,
                    new JsonSerializerSettings { Formatting = Formatting.Indented }));
        }
        private ClaimsIdentity GetIdentity(string login, string password)
        {
            ICollection<User> users = db.User.ToList();
            User user = users.FirstOrDefault(u => u.login == login && u.password == password);
            if (user == null)
                return null;
            else
            {
                Role role = db.Role.FirstOrDefault(r => r.id == user.role);
                var Claims = new List<Claim> {
                    new Claim (ClaimsIdentity.DefaultNameClaimType, user.id.ToString ())
                };
                Claims.Add(new Claim(ClaimsIdentity.DefaultRoleClaimType, role.name));
                ClaimsIdentity claimsIdentity =
                    new ClaimsIdentity(
                        Claims,
                        "Token",
                        ClaimsIdentity.DefaultNameClaimType,
                        ClaimsIdentity.DefaultRoleClaimType
                    );
                return claimsIdentity;
            }
        }
        private ClaimsIdentity NewIdentity(User user)
        {
            var Claims = new List<Claim> {
                new Claim (ClaimsIdentity.DefaultNameClaimType, user.id.ToString ()),
                new Claim (ClaimsIdentity.DefaultRoleClaimType, 2. ToString ())
            };
            ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(Claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            return claimsIdentity;
        }
    }
}